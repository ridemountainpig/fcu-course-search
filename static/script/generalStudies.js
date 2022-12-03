function getGeneralStudies(courseData) {
    console.log(Object.keys(courseData).length);
    
    console.log(courseData);
    for(let i = 0; i < Object.keys(courseData).length; i++) {
        let courseHtml = `
            <div class="min-[930px]:flex items-center justify-around p-2 my-2 bg-white rounded-xl">
                <div id="courseNumber" class="flex justify-center items-center p-5 m-3 text-gray-600 font-extrabold text-lg bg-slate-100 rounded-lg">
                    ${courseData[i].courseNumber}
                </div>
                <div class="flex justify-start ml-5" style="width: 200px;">
                    <div>
                        <div id="courseName" class="text-gray-600 font-bold text-xl">
                            ${courseData[i].courseName}
                        </div>
                        <div id="courseTime" class="text-gray-400 font-medium text-sm">
                            ${courseData[i].courseDate + " " + courseData[i].courseClass}
                        </div>
                    </div>
                </div>
                <div class="flex justify-start min-[930px]:justify-center items-center text-orange-400 font-bold text-xl ml-5 mt-2">
                    <div>${courseData[i].courseBalance}<i class="bi bi-lightning-fill px-2"></i>${courseData[i].courseSum}</div>
                </div>
                <div class="flex justify-center">
                    <a href="${courseData[i].courseIntroduceUrl}" target="_blank" class="p-5 m-3 text-gray-600 font-bold text-lg rounded-lg cursor-pointer hover:scale-75 duration-500" style="background-color: #dfe7d5;">課程大綱</a>
                </div>
            </div>
        `;
        $("#courseList").append(courseHtml);
    }

}