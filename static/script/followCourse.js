$(document).on("keypress", function (e) {
    if (e.which == 13) {
        addFollowCourse();
    }
});

function showLoading() {
    $("#coffeeBlock").removeClass("hidden");
    $("#coffeeIcon").addClass("w-full h-full");
    $("#coffeeBackground").addClass("w-full h-full");
    $("#coffeeIcon").removeClass("hidden");
    $("#coffeeBackground").removeClass("hidden");
}

function hideLoading() {
    $("#coffeeBlock").addClass("hidden");
    $("#coffeeIcon").removeClass("w-full h-full");
    $("#coffeeBackground").removeClass("w-full h-full");
    $("#coffeeIcon").addClass("hidden");
    $("#coffeeBackground").addClass("hidden");
}

function showErrorMessage(message) {
    let errorHtml = `
        <div class="notification">
            <p>${message}</p>
            <span class="notification_progress"></span>
        </div>
    `;
    $("#courseNumError").append(errorHtml);
}

function addFollowCourse() {
    showLoading();
    let courseNumber = $("#courseInput").val();
    $("#courseInput").val("");
    if (courseNumber == "") {
        hideLoading();
        showErrorMessage("請輸入課程號碼");
        return;
    }
    let followList = localStorage.getItem("followList");
    if (followList != null) {
        followList = followList.split(",");
        if (followList.includes(`${courseNumber}`)) {
            hideLoading();
            showErrorMessage("已關注此課程");
            return;
        }
    }
    $.ajax({
        url: "/checkcourse/" + courseNumber,
        success: function (res) {
            if (res == "true") {
                let followList = localStorage.getItem("followList");
                if (followList == null) {
                    followList = [];
                    followList.push(courseNumber);
                } else {
                    followList = followList.split(",");
                    if (!followList.includes(courseNumber)) {
                        followList.push(courseNumber);
                    }
                }
                localStorage.setItem("followList", followList);
                generateCourseList();
            } else {
                hideLoading();
                showErrorMessage("課程號碼錯誤");
            }
        },
    });
}

function deleteFollowCourse(courseNumber) {
    showLoading();
    let followList = localStorage.getItem("followList");
    followList = followList.split(",");
    followList.splice(followList.indexOf(courseNumber.toString()), 1);
    if (followList.length == 0) {
        followList = [];
    }
    localStorage.setItem("followList", followList);
    generateCourseList();
}

function generateCourseList() {
    showLoading();
    let followList = localStorage.getItem("followList");
    if (followList == null) {
        followList = [];
    }
    if (followList.length != 0) {
        $("#courseList").empty();
        $("#followNumber").empty();
        followList = followList.split(",");
        if (followList.includes("")) {
            $("#followNumber").append(followList.length - 1);
        } else {
            $("#followNumber").append(followList.length);
        }

        var data = {
            followList: followList,
        };

        $.ajax({
            type: "POST",
            url: "/searchcourselist",
            contentType: "application/json",
            data: JSON.stringify(data),

            success: function (courseData) {
                for (let i = Object.keys(courseData).length - 1; i >= 0; i--) {
                    let courseHtml = `
                            <div class="min-[1301px]:flex items-center justify-around p-2 my-2 bg-white rounded-xl">
                                <div id="courseNumber" class="flex justify-center items-center p-5 m-3 text-gray-600 font-extrabold text-lg bg-slate-100 rounded-lg">
                                    ${courseData[i].courseNumber}
                                </div>
                                <div class="flex justify-start max-[1301px]:justify-center max-[1301px]:text-center min-[1301px]:w-64">
                                    <div>
                                        <div id="courseName" class="text-gray-600 font-bold min-[1301px]:text-lg text-base">
                                            ${courseData[i].courseName}
                                        </div>
                                        <div id="courseTime" class="text-gray-400 font-medium mt-1 min-[1301px]:text-sm text-xs">
                                            ${courseData[i].courseDate}
                                        </div>
                                        <div id="courseTime" class="text-gray-400 font-medium mt-1 min-[1301px]:text-sm text-xs">
                                            ${courseData[i].courseClass}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex justify-center max-[1301px]:w-full">
                                    <div class="flex justify-center items-center text-orange-400 font-bold text-base min-[1301px]:text-xl min-[1301px]:w-26 w-fit mt-2">
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
                                    <button class="p-3 m-3 text-gray-600 font-bold text-base rounded-lg cursor-pointer bg-red-200" onclick="deleteFollowCourse(${courseData[i].courseNumber})">取消關注</button>
                                </div>
                            </div>
                        `;
                    $("#courseList").append(courseHtml);
                }

                setTimeout(function () {
                    hideLoading();
                }, 500);
            },
        });
    } else {
        let courseHtml = `
            <div class="flex items-center justify-around p-10 my-2 bg-white rounded-xl font-bold text-xl min-[555px]:text-3xl text-gray-600">
                尚未關注課程
            </div>
            <i class="bi bi-emoji-smile flex justify-center text-gray-600" style="margin-top: 10%; font-size: 80px;"></i>
        `;
        $("#followNumber").empty();
        $("#followNumber").append(0);
        $("#courseList").html(courseHtml);

        setTimeout(function () {
            hideLoading();
        }, 500);
    }
}
