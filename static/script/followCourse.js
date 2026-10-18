const code = codeBoxes(document.getElementById("followCode"));
const list = document.getElementById("courseList");
const grid = document.getElementById("courseGrid");
const timetable = document.getElementById("timetable");
const unscheduledEl = document.getElementById("unscheduled");
const followCount = document.getElementById("followCount");
const openCount = document.getElementById("openCount");
const followButton = document.getElementById("followButton");
const clashLegend = document.getElementById("clashLegend");
let courses = [];
let semesterReset;

// reset the follow list when the school moves to a new semester; returns true if it did
async function syncSemester() {
    try {
        const res = await fetch("/initYearAndSemester");
        const { year, semester } = await res.json();
        if (!year || !semester) return false;
        const current = `${year}-${semester}`;
        const previous = localStorage.getItem("year-semester");
        localStorage.setItem("year-semester", current);
        if (previous !== null && previous !== current) {
            setFollowList([]);
            return true;
        }
    } catch {
        // keep the existing list if the school system is unreachable
    }
    return false;
}

function renderSummary() {
    followCount.textContent = courses.length;
    const open = courses.filter((course) => seatInfo(course).left > 0).length;
    openCount.textContent = `${open} 門有名額`;
    openCount.hidden = open === 0;
}

function renderList() {
    list.innerHTML = courses.length
        ? courses
              .map((course) =>
                  courseItem(course, removeButton(course, "x")),
              )
              .join("")
        : `<div class="empty-state">還沒有關注的課程，輸入選課代號加入關注</div>`;
}

// one handler for every × (list rows, timetable blocks, unscheduled chips)
document.getElementById("courseList").parentElement.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove]");
    if (btn) removeCourse(btn.dataset.remove);
});

const removeButton = (course, cls) =>
    `<button class="${cls}" type="button" data-remove="${esc(
        course.courseNumber,
    )}" aria-label="取消關注 ${esc(course.courseName)}">×</button>`;

function renderTimetable() {
    // period 0 means the school has not scheduled a time (e.g. 碩士論文)
    const placed = courses.map((course) => ({
        course,
        slots: parseSchedule(course.courseDate).filter((s) => s.from >= 1),
    }));
    const allSlots = placed.flatMap((p) => p.slots);
    // weekdays always, weekend only when a followed course meets then
    const days = DAYS.filter(
        (d, i) => i < 5 || allSlots.some((s) => s.day === d),
    );
    const lastPeriod = Math.max(10, ...allSlots.map((s) => s.to));

    // clashing courses share the day column side by side, each in its own lane
    const blocks = placed.flatMap(({ course, slots }) =>
        slots.map((slot) => ({ course, slot, lane: 0, lanes: 1 })),
    );
    const lanesPerDay = days.map((d) => {
        const dayBlocks = blocks
            .filter((b) => b.slot.day === d)
            .sort((a, b) => a.slot.from - b.slot.from);
        let most = 1;
        let group = [];
        let groupEnd = 0;
        const closeGroup = () => {
            const lanes = Math.max(0, ...group.map((b) => b.lane)) + 1;
            group.forEach((b) => (b.lanes = lanes));
            most = Math.max(most, lanes);
        };
        dayBlocks.forEach((b) => {
            if (group.length && b.slot.from > groupEnd) {
                closeGroup();
                group = [];
            }
            const busy = new Set(
                group.filter((g) => g.slot.to >= b.slot.from).map((g) => g.lane),
            );
            while (busy.has(b.lane)) b.lane++;
            group.push(b);
            groupEnd = Math.max(groupEnd, b.slot.to);
        });
        if (group.length) closeGroup();
        return most;
    });

    timetable.style.gridTemplateColumns = `34px ${lanesPerDay
        .map((n) => `minmax(${84 * n}px, ${n}fr)`)
        .join(" ")}`;
    timetable.style.gridTemplateRows = `30px repeat(${lastPeriod}, 40px)`;

    const cell = (cls, row, col, body = "", extra = "") =>
        `<span class="${cls}" style="grid-row:${row};grid-column:${col}${extra}">${body}</span>`;
    let html = days.map((d, i) => cell("h", 1, i + 2, d)).join("");
    for (let p = 1; p <= lastPeriod; p++) {
        html += cell("p", p + 1, 1, p);
        days.forEach((_, i) => {
            html += cell("c", p + 1, i + 2);
        });
    }
    blocks.forEach(({ course, slot, lane, lanes }) => {
        const open = seatInfo(course).left > 0;
        // percentages on a grid item resolve against its grid area, i.e. the day column
        const split =
            lanes > 1
                ? `;width:calc((100% - ${lanes - 1} * 3px) / ${lanes});margin-left:calc((100% + 3px) * ${lane} / ${lanes})`
                : "";
        html += cell(
            `blk${open ? " ok" : ""}${lanes > 1 ? " clash" : ""}`,
            `${slot.from + 1} / ${slot.to + 2}`,
            days.indexOf(slot.day) + 2,
            `${esc(course.courseName)}<small>${esc(
                course.courseNumber,
            )}</small>${removeButton(course, "blk-x")}`,
            split,
        );
    });
    timetable.innerHTML = html;
    clashLegend.hidden = !blocks.some((b) => b.lanes > 1);

    const unscheduled = placed.filter((p) => p.slots.length === 0);
    unscheduledEl.hidden = unscheduled.length === 0;
    unscheduledEl.innerHTML =
        `<span class="unscheduled-label">未排時間</span>` +
        unscheduled
            .map(
                ({ course }) =>
                    `<span class="chip"><b class="num">${esc(
                        course.courseNumber,
                    )}</b>${esc(course.courseName)}${removeButton(
                        course,
                        "chip-x",
                    )}</span>`,
            )
            .join("");
}

function render() {
    renderSummary();
    renderList();
    renderTimetable();
}

async function loadCourses() {
    const followList = getFollowList();
    if (followList.length === 0) {
        courses = [];
        render();
        return;
    }
    list.innerHTML = followList
        .map(() => `<div class="skeleton"></div>`)
        .join("");
    try {
        const res = await fetch("/searchcourselist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ followList }),
        });
        const data = await res.json();
        // the semester check runs alongside; if it cleared the list, don't write old codes back
        if (await semesterReset) {
            courses = [];
            render();
            return;
        }
        const found = [];
        followList.forEach((courseNumber, i) => {
            if (data[i] && data[i] !== "false") found.push(data[i]);
        });
        // drop codes that no longer exist this semester
        setFollowList(found.map((course) => String(course.courseNumber)));
        courses = found;
        render();
    } catch {
        list.innerHTML = `<div class="empty-state">連不上學校的選課系統，請稍後重新整理。</div>`;
    }
}

function removeCourse(courseNumber) {
    const codes = getFollowList();
    const codeIndex = codes.indexOf(courseNumber);
    const index = courses.findIndex(
        (course) => String(course.courseNumber) === courseNumber,
    );
    if (index === -1) return;
    const [course] = courses.splice(index, 1);
    setFollowList(codes.filter((c) => c !== courseNumber));
    render();
    toast(`已取消關注 ${course.courseName}`, {
        label: "復原",
        onClick() {
            if (getFollowList().includes(courseNumber)) return;
            const restored = getFollowList();
            restored.splice(Math.max(codeIndex, 0), 0, courseNumber);
            setFollowList(restored);
            courses.splice(Math.min(index, courses.length), 0, course);
            render();
        },
    });
}

document.getElementById("followForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const courseNumber = code.input.value;
    if (courseNumber.length !== 4) {
        toast("請輸入四位數選課代號");
        code.input.focus();
        return;
    }
    if (getFollowList().includes(courseNumber)) {
        toast("已關注此課程");
        code.clear();
        return;
    }
    followButton.disabled = true;
    followButton.textContent = "查詢中…";
    try {
        const course = await fetchCourse(courseNumber);
        if (course) {
            addToFollowList(courseNumber);
            courses.push(course);
            render();
            code.clear();
            toast(`已關注 ${course.courseName}`);
        } else {
            toast("找不到這個選課代號");
        }
    } catch {
        toast("連不上學校的選課系統，請稍後再試");
    } finally {
        followButton.disabled = false;
        followButton.textContent = "加入關注";
    }
});

const viewList = document.getElementById("viewList");
const viewGrid = document.getElementById("viewGrid");
function setView(showGrid) {
    list.hidden = showGrid;
    grid.hidden = !showGrid;
    viewList.setAttribute("aria-selected", !showGrid);
    viewGrid.setAttribute("aria-selected", showGrid);
    try {
        localStorage.setItem("followView", showGrid ? "grid" : "list");
    } catch {}
}
viewList.addEventListener("click", () => setView(false));
viewGrid.addEventListener("click", () => setView(true));
setView(localStorage.getItem("followView") === "grid");

semesterReset = syncSemester();
loadCourses();
semesterReset.then((reset) => {
    if (reset) {
        courses = [];
        render();
    }
});
