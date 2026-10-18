const courses = Object.values(courseData || {})
    .map((course) => ({
        ...course,
        days: new Set(
            parseSchedule(course.courseDate)
                .filter((slot) => slot.from >= 1)
                .map((slot) => slot.day),
        ),
    }))
    .sort((a, b) => seatInfo(b).left - seatInfo(a).left);

const list = document.getElementById("courseList");
const count = document.getElementById("courseCount");
const daysEl = document.getElementById("days");
let day = null;

function render() {
    if (courseData === null) {
        list.innerHTML = `<div class="empty-state">連不上學校的選課系統，請稍後重新整理。</div>`;
        count.textContent = "";
        return;
    }
    if (courses.length === 0) {
        list.innerHTML = `<div class="empty-state">通識課程皆已額滿</div>`;
        count.textContent = "";
        return;
    }
    const rows = courses.filter((course) => !day || course.days.has(day));
    list.innerHTML = rows.length
        ? rows
              .map((course) =>
                  courseItem(
                      course,
                      `<a class="btn line sm" href="${esc(
                          course.courseIntroduceUrl,
                      )}" target="_blank" rel="noopener" title="${esc(
                          course.courseName,
                      )}課程大綱">大綱 ↗</a>`,
                  ),
              )
              .join("")
        : `<div class="empty-state">星期${day}沒有還有名額的通識課</div>`;
    count.textContent = `${rows.length} / ${courses.length}`;
}

// weekdays always, weekend only when a course meets then
daysEl.innerHTML = DAYS.filter(
    (d, i) => i < 5 || courses.some((course) => course.days.has(d)),
)
    .map(
        (d) =>
            `<button type="button" aria-pressed="false" data-day="${d}">${d}</button>`,
    )
    .join("");
daysEl.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
        day = day === btn.dataset.day ? null : btn.dataset.day;
        daysEl
            .querySelectorAll("button")
            .forEach((b) =>
                b.setAttribute("aria-pressed", b.dataset.day === day),
            );
        render();
    });
});

render();
