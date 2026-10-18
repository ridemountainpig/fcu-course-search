const DAYS = ["一", "二", "三", "四", "五", "六", "日"];

function esc(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        (c) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;",
            })[c],
    );
}

// action: optional { label, onClick } shown as a button inside the toast
function toast(message, action) {
    const box = document.getElementById("toasts");
    const el = document.createElement("div");
    el.className = "toast";
    const text = document.createElement("span");
    text.className = "toast-text";
    text.textContent = message;
    el.appendChild(text);
    const dismiss = () => {
        el.classList.add("out");
        setTimeout(() => el.remove(), 250);
    };
    if (action) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = action.label;
        btn.addEventListener("click", () => {
            action.onClick();
            dismiss();
        });
        el.appendChild(btn);
    }
    box.appendChild(el);
    setTimeout(dismiss, action ? 5000 : 2600);
}

// courseBalance is the number of students already enrolled, courseSum the capacity
function seatInfo(course) {
    const sum = Number(course.courseSum) || 0;
    const taken = Number(course.courseBalance) || 0;
    const left = Math.max(sum - taken, 0);
    let state = "ok";
    let label = "有名額";
    if (left === 0) {
        state = "full";
        label = "已額滿";
    } else if (left / sum <= 0.1) {
        state = "low";
        label = `剩 ${left} 位`;
    }
    return { sum, left, state, label };
}

function seatDots(seat) {
    const filled =
        seat.left === 0 || seat.sum === 0
            ? 0
            : Math.max(1, Math.round((seat.left / seat.sum) * 20));
    let dots = "";
    for (let i = 0; i < 20; i++) {
        dots += `<i class="${i < filled ? "f" : ""}"></i>`;
    }
    return `<span class="dotbar${
        seat.state === "low" ? " low" : ""
    }">${dots}</span>`;
}

function seatColumn(course) {
    const seat = seatInfo(course);
    return `
        <span class="seatcol">
            <span class="row1">
                <span class="num">${seat.left}<small> / ${
                    seat.sum
                }</small></span>
                <span class="status ${seat.state}">${seat.label}</span>
            </span>
            ${seatDots(seat)}
        </span>`;
}

// "(二)03-04 資電234 (四)02 資電234" -> [{ day: "二", from: 3, to: 4 }, { day: "四", from: 2, to: 2 }]
function parseSchedule(courseDate) {
    const slots = [];
    const pattern = /\(([一二三四五六日])\)\s*([0-9][0-9,\-]*)/g;
    let match;
    while ((match = pattern.exec(courseDate || "")) !== null) {
        const periods = [];
        match[2].split(",").forEach((part) => {
            const [a, b] = part.split("-").map((n) => parseInt(n, 10));
            if (Number.isNaN(a)) return;
            for (
                let p = a;
                p <= (Number.isNaN(b) || b === undefined ? a : b);
                p++
            ) {
                periods.push(p);
            }
        });
        periods.sort((x, y) => x - y);
        periods.forEach((p) => {
            const last = slots[slots.length - 1];
            if (last && last.day === match[1] && last.to === p - 1) {
                last.to = p;
            } else {
                slots.push({ day: match[1], from: p, to: p });
            }
        });
    }
    return slots;
}

// "(二)03-04 資電234" -> "(二) 3-4 資電234"; "(一)0 未排教室" -> "未排時間"
function prettyDate(courseDate) {
    return String(courseDate || "")
        .replace(
            /\([一二三四五六日]\)\s*0+(?![0-9,\-])(\s*(未排教室|待排))?/g,
            "未排時間",
        )
        .replace(
            /\(([一二三四五六日])\)\s*([0-9][0-9,\-]*)/g,
            (_, day, periods) =>
                `(${day}) ${periods.replace(/\b0(\d)/g, "$1")}`,
        );
}

function courseItem(course, action) {
    const chips = [prettyDate(course.courseDate), course.courseClass]
        .filter(Boolean)
        .map((text) => `<span class="chip">${esc(text)}</span>`)
        .join("");
    return `
        <div class="item">
            <span class="codebadge">${esc(course.courseNumber)}</span>
            <span class="item-name">
                <b>${esc(course.courseName)}</b>
                <span class="item-sub">${chips}</span>
            </span>
            ${seatColumn(course)}
            ${action}
        </div>`;
}

// four boxes drawn over one transparent numeric input
function codeBoxes(label) {
    const input = label.querySelector("input");
    const boxes = [];
    for (let i = 0; i < 4; i++) {
        const box = document.createElement("span");
        box.className = "box";
        box.setAttribute("aria-hidden", "true");
        label.appendChild(box);
        boxes.push(box);
    }
    const paint = () => {
        input.value = input.value.replace(/\D/g, "").slice(0, 4);
        boxes.forEach((box, i) => {
            const ch = input.value[i];
            box.textContent = ch ?? "";
            box.classList.toggle("is-empty", !ch);
            box.classList.toggle("cur", i === Math.min(input.value.length, 3));
        });
    };
    // "stale" keeps the last code visible but lets the next keystroke start over
    const setStale = (stale) => label.classList.toggle("is-stale", stale);
    input.addEventListener("beforeinput", (e) => {
        if (!label.classList.contains("is-stale")) return;
        setStale(false);
        if (e.inputType.startsWith("insert")) {
            input.value = "";
        } else if (e.inputType.startsWith("delete")) {
            e.preventDefault();
            input.value = "";
            paint();
        }
    });
    input.addEventListener("input", paint);
    paint();
    return {
        input,
        paint,
        setStale,
        clear() {
            setStale(false);
            input.value = "";
            paint();
        },
    };
}

// follow list lives in localStorage as a comma separated string, as before
function getFollowList() {
    const raw = localStorage.getItem("followList");
    return raw ? raw.split(",").filter(Boolean) : [];
}

function setFollowList(list) {
    localStorage.setItem("followList", list.join(","));
}

function addToFollowList(courseNumber) {
    const list = getFollowList();
    if (list.includes(courseNumber)) return false;
    list.push(courseNumber);
    setFollowList(list);
    return true;
}

async function fetchCourse(courseNumber) {
    const res = await fetch(
        "/searchcourse/" + encodeURIComponent(courseNumber),
    );
    if (!res.ok) throw new Error(res.status);
    const text = await res.text();
    if (text.trim() === "false") return null;
    const data = JSON.parse(text);
    return data[0] ?? null;
}
