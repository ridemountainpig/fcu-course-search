const code = codeBoxes(document.getElementById("searchCode"));
const result = document.getElementById("result");
const button = document.getElementById("searchButton");
const page = document.getElementById("searchPage");
const recent = document.getElementById("recent");
const recentList = document.getElementById("recentList");

// last few successful searches, newest first: [{ code, name }]
function getRecent() {
    try {
        return JSON.parse(localStorage.getItem("recentSearches")) || [];
    } catch {
        return [];
    }
}

function saveRecent(course) {
    const code = String(course.courseNumber);
    const list = getRecent().filter((item) => item.code !== code);
    list.unshift({ code, name: course.courseName });
    localStorage.setItem("recentSearches", JSON.stringify(list.slice(0, 6)));
}

function renderRecent() {
    const list = getRecent();
    recent.hidden = list.length === 0;
    recentList.innerHTML = list
        .map(
            (item) =>
                `<button type="button" data-code="${esc(
                    item.code,
                )}"><span class="num">${esc(item.code)}</span><span>${esc(
                    item.name,
                )}</span></button>`,
        )
        .join("");
    recentList.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
            code.input.value = btn.dataset.code;
            code.paint();
            searchCourse(btn.dataset.code);
        });
    });
}

function renderCourse(course) {
    const seat = seatInfo(course);
    const followed = getFollowList().includes(String(course.courseNumber));
    const facts = [
        ["時間", prettyDate(course.courseDate)],
        ["教師", course.courseTeacher],
        ["班級", course.courseClass],
    ]
        .filter(([, value]) => value)
        .map(
            ([key, value]) =>
                `<span class="chip">${key} <b>${esc(value)}</b></span>`,
        )
        .join("");

    result.innerHTML = `
        <article class="ticket">
            <div class="stub">
                <small>選課代號</small>
                <span class="num">${esc(course.courseNumber)}</span>
            </div>
            <div class="tbody">
                <h2>${esc(course.courseName)}</h2>
                <div class="facts">${facts}</div>
                <div>
                    <div class="seat-line">
                        <span class="num">${seat.left}<small> / ${
                            seat.sum
                        }</small></span>
                        <span class="status ${seat.state}">${seat.label}</span>
                    </div>
                    ${seatDots(seat)}
                </div>
                <div class="tactions">
                    <a class="btn pen sm" href="${esc(
                        course.courseIntroduceUrl,
                    )}" target="_blank" rel="noopener" title="${esc(
                        course.courseName,
                    )}課程大綱">課程大綱 ↗</a>
                    <button class="btn line sm" type="button" id="followButton" ${
                        followed ? "disabled" : ""
                    }>${followed ? "已關注" : "＋ 關注"}</button>
                </div>
            </div>
        </article>`;

    const followButton = document.getElementById("followButton");
    followButton.addEventListener("click", () => {
        addToFollowList(String(course.courseNumber));
        followButton.textContent = "已關注";
        followButton.disabled = true;
        toast(`已關注 ${course.courseName}`);
    });
}

async function searchCourse(courseNumber) {
    page.dataset.state = "result";
    button.disabled = true;
    button.textContent = "查詢中…";
    result.innerHTML = `<div class="skeleton" style="margin-top:28px;max-width:720px;height:220px"></div>`;
    try {
        const course = await fetchCourse(courseNumber);
        if (course) {
            renderCourse(course);
            code.setStale(true);
            // keep the keyboard closed on phones so the result stays in view
            if (matchMedia("(pointer: fine)").matches) code.input.focus();
            saveRecent(course);
            renderRecent();
            history.replaceState(null, "", "?q=" + courseNumber);
        } else {
            result.innerHTML = `<div class="notice">找不到選課代號 <b>${esc(
                courseNumber,
            )}</b> 的課程，請確認號碼後再試一次。</div>`;
        }
    } catch {
        result.innerHTML = `<div class="notice">連不上學校的選課系統，請稍後再試。</div>`;
    } finally {
        button.disabled = false;
        button.textContent = "查詢";
    }
}

document.getElementById("searchForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const value = code.input.value;
    if (value.length !== 4) {
        toast("請輸入四位數選課代號");
        code.input.focus();
        return;
    }
    searchCourse(value);
});

renderRecent();

const initial = new URLSearchParams(location.search).get("q");
if (initial && /^\d{4}$/.test(initial)) {
    code.input.value = initial;
    code.paint();
    searchCourse(initial);
}
