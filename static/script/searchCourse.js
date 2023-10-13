$(document).on("keypress", function (e) {
    if (e.which == 13) {
        searchCourse();
    }
});

function searchCourse() {
    let courseNumber = $("#courseInput").val();

    if (courseNumber == "") {
        return;
    }

    $("#searchInput").addClass("hidden");
    $("#courseListBox").removeClass("hidden");
    $("#courseInput").val("");

    $.ajax({
        url: "/searchcourse/" + courseNumber,
        success: function (res) {
            if (res != "false") {
                let courseData = res;
                let courseHtml = `
                        <div class="items-center justify-around py-6 px-10 -mt-20 bg-white rounded-xl shadow-2xl">
                            <div>
                                <div id="courseNumber" class="flex justify-center items-center p-5 m-3 -mt-14 text-gray-600 font-extrabold text-lg bg-backgroundGreen rounded-lg">
                                ${courseData[0].courseNumber}
                                </div>
                                <div class="flex justify-end">
                                    <div class="w-10 h-10 bg-orange-400 text-white rounded-full flex justify-center items-center -mr-14 -mt-16 cursor-pointer" onclick="resetSearchCourse()">
                                        <i class="bi bi-x-lg" style=" font-size: 22px;"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-start ml-5 mt-5" style="width: 200px;">
                                <div>
                                    <div id="courseName" class="text-gray-600 font-bold text-xl">
                                        ${courseData[0].courseName}
                                    </div>
                                    <div id="courseTime" class="text-gray-400 font-medium text-sm my-2">
                                        開課系所：${courseData[0].courseClass}
                                    </div>
                                    <div id="courseTime" class="text-gray-400 font-medium text-sm my-2">
                                        上課時間：${courseData[0].courseDate}
                                    </div>
                                    <div id="courseTime" class="text-gray-400 font-medium text-sm my-2">
                                        教師：${courseData[0].courseTeacher}
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-center items-center text-orange-400 font-bold text-xl mt-2">
                                <div>${courseData[0].courseBalance}<i class="bi bi-lightning-fill px-2"></i>${courseData[0].courseSum}</div>
                            </div>
                            <div class="flex justify-center">
                                <a href="${courseData[0].courseIntroduceUrl}" target="_blank" class="p-5 m-3 text-gray-600 font-bold text-lg rounded-lg cursor-pointer bg-backgroundGreen">課程大綱</a>
                            </div>
                        </div>
                    `;
                $("#courseList").append(courseHtml);
            } else {
                let courseHtml = `
                        <div class="items-center justify-around py-6 px-10 -mt-20 bg-white rounded-xl shadow-2xl">
                            <div>
                                <div id="courseNumber" class="flex justify-center items-center p-5 m-3 -mt-14 text-gray-600 font-extrabold text-lg bg-backgroundGreen rounded-lg">
                                ${courseNumber}
                                </div>
                                <div class="flex justify-end">
                                    <div class="w-10 h-10 bg-orange-400 text-white rounded-full flex justify-center items-center -mr-14 -mt-16 cursor-pointer" onclick="resetSearchCourse()">
                                        <i class="bi bi-x-lg" style=" font-size: 22px;"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-center mt-5">
                                <div>
                                    <div id="courseName" class="text-gray-600 font-bold text-xl">
                                        課程號碼錯誤，查無此課程
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                $("#courseList").append(courseHtml);
            }
        },
    });
}

function resetSearchCourse() {
    $("#searchInput").removeClass("hidden");
    $("#courseListBox").addClass("hidden");
    $("#courseList").empty();
}
