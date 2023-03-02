function getGeneralStudies(courseData) {
    
    if (Object.keys(courseData).length === 0) {
        let courseHtml = `
            <div class="flex items-center justify-around p-10 my-2 bg-white rounded-xl font-bold text-xl min-[555px]:text-3xl text-gray-600" style="margin-top: 10%;">通識課程皆已額滿</div>
            <i class="bi bi-emoji-frown flex justify-center text-gray-600" style="margin-top: 20%; font-size: 80px;"></i>
        `
        $('#courseList').html(courseHtml);
        return;
    }
    
    for(let i = 0; i < Object.keys(courseData).length; i++) {
        let courseHtml = `
            <div class="min-[930px]:flex items-center justify-around p-2 my-2 bg-white rounded-xl">
                <div id="courseNumber" class="flex justify-center items-center p-5 m-3 text-gray-600 font-extrabold text-lg bg-slate-100 rounded-lg">
                    ${courseData[i].courseNumber}
                </div>
                <div class="flex justify-start max-[930px]:ml-5" style="width: 260px;">
                    <div>
                        <div id="courseName" class="text-gray-600 font-bold text-xl">
                            ${courseData[i].courseName}
                        </div>
                        <div id="courseTime" class="text-gray-400 font-medium text-sm">
                            ${courseData[i].courseDate + " " + courseData[i].courseClass}
                        </div>
                    </div>
                </div>
                <div class="flex justify-start min-[930px]:justify-center items-center text-orange-400 font-bold text-xl max-[930px]:ml-5 mt-2">
                    <div>${courseData[i].courseBalance}<i class="bi bi-lightning-fill px-2"></i>${courseData[i].courseSum}</div>
                </div>
                <div class="flex justify-center">
                    <a href="${courseData[i].courseIntroduceUrl}" target="_blank" class="p-5 m-3 text-gray-600 font-bold text-lg rounded-lg cursor-pointer" style="background-color: #dfe7d5;">課程大綱</a>
                </div>
            </div>
        `;
        $("#courseList").append(courseHtml);
    }

}