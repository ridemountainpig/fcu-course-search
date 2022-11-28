import requests

s = requests.Session()


def getCourse():
    # 通識 mode = 2
    mode = 2
    data = '{"baseOptions":{"lang":"cht","year":111,"sms":1},"typeOptions":{"code":{"enabled":false,"value":""},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":true,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'

    # 課程代碼 mode = 2
    # mode = 2
    # data = '{"baseOptions":{"lang":"cht","year":111,"sms":1},"typeOptions":{"code":{"enabled":true,"value":"1406"},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":false,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'

    # 系所查詢 mode = 1
    # mode = 1
    # data = '{"baseOptions":{"lang":"cht","year":111,"sms":1},"typeOptions":{"degree":"1","deptId":"CI","unitId":"CE07","classId":"CE07134"}}'

    # data["_token"]=token
    header = {
        "Content-Type":
        "application/json",
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }
    if mode == 1:
        res = s.post(
            "https://coursesearch02.fcu.edu.tw/Service/Search.asmx/GetType1Result",
            data=data,
            headers=header)
    else:
        res = s.post(
            "https://coursesearch02.fcu.edu.tw/Service/Search.asmx/GetType2Result",
            data=data,
            headers=header)

    courseList = res.text.split(r'{\"scr_selcode\":\"')

    balanceCourse = {}
    count = 0
    for i in range(1, len(courseList)):
        courseData = courseList[i].split(r'\",\"')
        courseNumber = courseData[0]
        courseName = courseData[2].split(r'\":\"')[1]
        courseDate = courseData[8].split(r'\":\"')[1].split(' ')[0]
        courseSum = courseData[9].split(r'\":')[1].split(r',')[0]
        courseBlance = courseData[9].split(r'\":')[2].split(r',')[0]

        if courseBlance < courseSum:
            balanceCourse[count] = {
                "courseNumber": courseNumber,
                "courseName": courseName,
                "courseDate": courseDate,
                "courseBalance": courseBlance,
                "courseSum": courseSum
            }
            count += 1
    return balanceCourse
