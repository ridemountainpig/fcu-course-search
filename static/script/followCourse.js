$(document).on('keypress', function (e) {
    if (e.which == 13) {
        addFollowCourse();
    }
});

function addFollowCourse() {
    $('#coffeeIcon').removeClass('invisible');
    $('#coffeeBackground').removeClass('invisible');
    let courseNumber = $("#courseInput").val();
    $("#courseInput").val("");
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
                $('#courseNumError').removeClass('-mr-24');
                setTimeout(function () {
                    $('#courseNumError').addClass('-mr-24');
                }, 3000);
                $('#coffeeIcon').addClass('invisible');
                $('#coffeeBackground').addClass('invisible');
            }
        }
    })
}

function deleteFollowCourse(courseNumber) {
    $('#coffeeIcon').removeClass('invisible');
    $('#coffeeBackground').removeClass('invisible');
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
    $('#coffeeIcon').removeClass('invisible');
    $('#coffeeBackground').removeClass('invisible');
    let followList = localStorage.getItem("followList");
    if (followList == null) {
        followList = [];
    }
    if (followList.length != 0) {
        $('#courseList').empty();
        $('#followNumber').empty();
        followList = followList.split(",");
        if (followList.includes('')) {
            $('#followNumber').append(followList.length - 1);
        } else {
            $('#followNumber').append(followList.length);
        }
        for (let i = followList.length - 1; i >= 0; i--) {
            if (followList[i] == '') continue
            $.ajax({
                async: false,
                url: "/getCourse/" + followList[i],
                success: function (courseData) {
                    let courseHtml = `
                        <div class="min-[1301px]:flex items-center justify-around p-2 my-2 bg-white rounded-xl">
                            <div id="courseNumber" class="flex justify-center items-center p-5 m-3 text-gray-600 font-extrabold text-lg bg-slate-100 rounded-lg">
                                ${courseData[0].courseNumber}
                            </div>
                            <div class="flex justify-start max-[1301px]:ml-5 min-[1301px]:w-64">
                                <div>
                                    <div id="courseName" class="text-gray-600 font-bold min-[1301px]:text-lg text-base">
                                        ${courseData[0].courseName}
                                    </div>
                                    <div id="courseTime" class="text-gray-400 font-medium min-[1301px]:text-sm text-xs">
                                        ${courseData[0].courseDate}
                                    </div>
                                    <div id="courseTime" class="text-gray-400 font-medium min-[1301px]:text-sm text-xs">
                                        ${courseData[0].courseClass}
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-center items-center text-orange-400 font-bold text-xl mt-2">
                                <div>${courseData[0].courseBalance}<i class="bi bi-lightning-fill px-2"></i>${courseData[0].courseSum}</div>
                            </div>
                            <div class="flex justify-center">
                                <button class="p-3 m-3 text-gray-600 font-bold text-base rounded-lg cursor-pointer bg-red-200" onclick="deleteFollowCourse(${courseData[0].courseNumber})">取消關注</button>
                            </div>
                        </div>
                    `;
                    $("#courseList").append(courseHtml);
                }
            })
        }
    } else {
        let courseHtml = `
            <div class="flex items-center justify-around p-10 my-2 bg-white rounded-xl font-bold text-xl min-[555px]:text-3xl text-gray-600" style="margin-top: 5%;">尚未關注課程</div>
            <i class="bi bi-emoji-smile flex justify-center text-gray-600" style="margin-top: 10%; font-size: 80px;"></i>
        `
        $('#followNumber').empty();
        $('#followNumber').append(0);
        $('#courseList').html(courseHtml);
    }
    setTimeout(function () {
        $('#coffeeIcon').addClass('invisible');
        $('#coffeeBackground').addClass('invisible');
    }, 1500);
}