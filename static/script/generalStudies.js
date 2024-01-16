$(document).ready(() => {
    const courseList = document.querySelector("#courseList");
    $("#scrollToTopIcon").addClass("hidden");
    courseList.addEventListener("scroll", () => {
        if (courseList.scrollTop < 100) {
            $("#scrollToTopIcon").addClass("hidden");
        } else {
            $("#scrollToTopIcon").removeClass("hidden");
        }
    });
});

function getGeneralStudies(courseData) {
    if (Object.keys(courseData).length === 0) {
        let courseHtml = `
            <div class="flex items-center justify-around p-10 my-2 bg-white rounded-xl font-bold text-xl min-[555px]:text-3xl text-gray-600">通識課程皆已額滿</div>
            <i class="bi bi-emoji-frown flex justify-center text-gray-600" style="margin-top: 10%; font-size: 80px;"></i>
        `;
        $("#courseList").html(courseHtml);
        return;
    }

    for (let i = 0; i < Object.keys(courseData).length; i++) {
        let courseHtml = `
            <div class="min-[930px]:flex items-center justify-around p-2 my-2 bg-white rounded-xl">
                <div id="courseNumber" class="flex justify-center items-center min-[930px]:p-5 p-3 m-3 text-gray-600 font-extrabold min-[930px]:text-lg text-base bg-slate-100 rounded-lg">
                    ${courseData[i].courseNumber}
                </div>
                <div class="flex justify-start min-[930px]:w-72 max-[930px]:flex max-[930px]:justify-center max-[930px]:text-center">
                    <div>
                        <div id="courseName" class="text-gray-600 font-bold min-[930px]:text-xl text-base">
                            ${courseData[i].courseName}
                        </div>
                        <div id="courseTime" class="text-gray-400 mt-1 font-medium min-[930px]:text-sm text-xs">
                            ${courseData[i].courseDate}
                        </div>
                        <div id="courseTime" class="text-gray-400 mt-1 font-medium min-[930px]:text-sm text-xs">
                            ${courseData[i].courseClass}
                        </div>
                    </div>
                </div>
                <div class="flex justify-center max-[930px]:w-full">
                    <div class="flex justify-center items-center text-orange-400 font-bold text-base min-[930px]:text-xl min-[930px]:w-26 w-fit mt-2">
                        <div class="flex justify-center w-1/3">
                            <div>${courseData[i].courseBalance}</div>
                        </div>
                        <div class="flex justify-center w-1/3">
                            <i class="bi bi-lightning-fill px-2"></i>
                        </div>
                        <div class="flex justify-center w-1/3">
                            <div>${courseData[i].courseSum}</div>
                        </div>
                    </div>
                </div>
                <div class="flex justify-center">
                    <a href="${courseData[i].courseIntroduceUrl}" target="_blank" title="${courseData[i].courseName}課程大綱" class="p-3 m-2 text-gray-600 font-bold text-base rounded-lg cursor-pointer bg-backgroundGreen">課程大綱</a>
                </div>
            </div>
        `;
        $("#courseList").append(courseHtml);
    }
}

function scrollToTop() {
    const courseList = document.querySelector("#courseList");
    courseList.scrollTo({ top: 0, behavior: "smooth" });
}
