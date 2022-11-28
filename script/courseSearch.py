import requests

s = requests.Session()

# system year
year = '111'
system = '1'


def getGeneralCourseList():
    data = '{"baseOptions":{"lang":"cht","year":' + year + ',"sms":' + system + '},"typeOptions":{"code":{"enabled":false,"value":""},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":true,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'
    print(data)
    header = {
        "Content-Type":
        "application/json",
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }

    response = s.post(
        "https://coursesearch02.fcu.edu.tw/Service/Search.asmx/GetType2Result",
        data=data,
        headers=header
    )

    courseList = response.text.split(r'{\"scr_selcode\":\"')
    return courseListToDict(courseList)
   


def getCourseByCode(courseCode):
    data = '{"baseOptions":{"lang":"cht","year":' + year + ',"sms":' + system + '},"typeOptions":{"code":{"enabled":true,"value":"' + str(courseCode) + '"},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":false,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'

    header = {
        "Content-Type":
        "application/json",
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }

    response = s.post(
        "https://coursesearch02.fcu.edu.tw/Service/Search.asmx/GetType2Result",
        data=data,
        headers=header
    )

    courseList = response.text.split(r'{\"scr_selcode\":\"')
    return courseListToDict(courseList)

def courseListToDict(courseList):
    result = {}
    count = 0
    for i in range(1, len(courseList)):
        courseData = courseList[i].split(r'\",\"')
        courseNumber = courseData[0]
        courseName = courseData[2].split(r'\":\"')[1]
        courseDate = courseData[8].split(r'\":\"')[1].split(' ')[0]
        courseSum = courseData[9].split(r'\":')[1].split(r',')[0]
        courseBlance = courseData[9].split(r'\":')[2].split(r',')[0]

        if courseBlance < courseSum:
            result[count] = {
                "courseNumber": courseNumber,
                "courseName": courseName,
                "courseDate": courseDate,
                "courseBalance": courseBlance,
                "courseSum": courseSum
            }
            count += 1
    return result

