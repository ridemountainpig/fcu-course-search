import requests

s = requests.Session()

# system year
year = '112'
semester = '1'

def checkCourse(courseCode):
    data = '{"baseOptions":{"lang":"cht","year":' + year + ',"sms":' + semester + '},"typeOptions":{"code":{"enabled":true,"value":"' + \
        str(courseCode) + '"},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":false,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'

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

    courseNumber = (response.text.split(','))[1].split(':')[1]
    if courseNumber == '0':
        return "false"
    else:
        return "true"

def searchCourseByCode(courseCode):
    data = '{"baseOptions":{"lang":"cht","year":' + year + ',"sms":' + semester + '},"typeOptions":{"code":{"enabled":true,"value":"' + \
        str(courseCode) + '"},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":false,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'

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

    temp = response
    courseNumber = (temp.text.split(','))[1].split(':')[1]
    if courseNumber == '0':
        return "false"
    else:   
        courseList = response.text.split(r'{\"scr_selcode\":\"')
        courseData = byCodeCourseListToDict(courseList)
        return courseData

def getGeneralCourseList():
    data = '{"baseOptions":{"lang":"cht","year":' + year + ',"sms":' + semester + '},"typeOptions":{"code":{"enabled":false,"value":""},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":true,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'

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

def getAppGeneralCourseList():
    data = '{"baseOptions":{"lang":"cht","year":' + year + ',"sms":' + semester + '},"typeOptions":{"code":{"enabled":false,"value":""},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":true,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'

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
    return appCourseListToDict(courseList)

def getCourseByCode(courseCode):
    data = '{"baseOptions":{"lang":"cht","year":' + year + ',"sms":' + semester + '},"typeOptions":{"code":{"enabled":true,"value":"' + \
        str(courseCode) + '"},"weekPeriod":{"enabled":false,"week":"*","period":"*"},"course":{"enabled":false,"value":""},"teacher":{"enabled":false,"value":""},"useEnglish":{"enabled":false},"useLanguage":{"enabled":false,"value":"01"},"specificSubject":{"enabled":false,"value":"1"},"courseDescription":{"enabled":false,"value":""}}}'

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
    return byCodeCourseListToDict(courseList)


def byCodeCourseListToDict(courseList):
    result = {}
    count = 0
    courseUrlTitle = "https://coursesearch02.fcu.edu.tw/CourseOutline.aspx?lang=cht&courseid="

    for i in range(1, len(courseList)):
        courseData = courseList[i].split(r'\",\"')
        courseNumber = courseData[0]
        courseName = courseData[2].split(r'\":\"')[1]
        courseClass = courseData[7].split(r'\":\"')[1]
        courseDate = []
        for i in courseData[8].split(r'\":\"')[1].split(' ')[:-1]:
            if i != '':
                courseDate.append(i)
        courseDate = ' '.join(courseDate)
        courseTeacher = courseData[8].split(r'\":\"')[1].split(' ')[-1]
        courseSum = courseData[9].split(r'\":')[1].split(r',')[0][:-2]
        courseBlance = courseData[9].split(r'\":')[2].split(r',')[0][:-2]
        courseUrlCls = courseData[10].split(r'\":\"')[1].split(r'\"')[0]
        courseUrlSub = courseData[11].split(r'\":\"')[1].split(r'\"')[0]
        courseUrlSrc = courseData[12].split(r'\":\"')[1].split(r'\"')[0]
        courseIntroduceUrl = f"{courseUrlTitle + year + semester + courseUrlCls + courseUrlSub + courseUrlSrc}"

        result[count] = {
            "courseNumber": courseNumber,
            "courseName": courseName,
            "courseClass": courseClass,
            "courseDate": courseDate,
            "courseTeacher": courseTeacher,
            "courseBalance": courseBlance,
            "courseSum": courseSum,
            "courseIntroduceUrl": courseIntroduceUrl
        }
        count += 1
    return result


def courseListToDict(courseList):
    result = {}
    count = 0
    courseUrlTitle = "https://coursesearch02.fcu.edu.tw/CourseOutline.aspx?lang=cht&courseid="
    for i in range(1, len(courseList)):
        courseData = courseList[i].split(r'\",\"')
        courseNumber = courseData[0]
        courseName = courseData[2].split(r'\":\"')[1]
        courseClass = courseData[7].split(r'\":\"')[1]
        courseDate = courseData[8].split(r'\":\"')[1].split(' ')[0]
        courseSum = courseData[9].split(r'\":')[1].split(r',')[0][:-2]
        courseBlance = courseData[9].split(r'\":')[2].split(r',')[0][:-2]
        courseUrlCls = courseData[10].split(r'\":\"')[1].split(r'\"')[0]
        courseUrlSub = courseData[11].split(r'\":\"')[1].split(r'\"')[0]
        courseUrlSrc = courseData[12].split(r'\":\"')[1].split(r'\"')[0]
        courseIntroduceUrl = f"{courseUrlTitle + year + semester + courseUrlCls + courseUrlSub + courseUrlSrc}"

        if courseBlance < courseSum:
            result[count] = {
                "courseNumber": courseNumber,
                "courseName": courseName,
                "courseClass": courseClass,
                "courseDate": courseDate,
                "courseBalance": courseBlance,
                "courseSum": courseSum,
                "courseIntroduceUrl": courseIntroduceUrl
            }
            count += 1
    return result

def appCourseListToDict(courseList):
    result = []
    count = 0
    courseUrlTitle = "https://coursesearch02.fcu.edu.tw/CourseOutline.aspx?lang=cht&courseid="
    for i in range(1, len(courseList)):
        courseData = courseList[i].split(r'\",\"')
        courseNumber = courseData[0]
        courseName = courseData[2].split(r'\":\"')[1]
        courseClass = courseData[7].split(r'\":\"')[1]
        courseDate = []
        for i in courseData[8].split(r'\":\"')[1].split(' ')[:-1]:
            if i != '':
                courseDate.append(i)
        courseDate = ' '.join(courseDate)
        courseSum = courseData[9].split(r'\":')[1].split(r',')[0][:-2]
        courseBlance = courseData[9].split(r'\":')[2].split(r',')[0][:-2]
        courseUrlCls = courseData[10].split(r'\":\"')[1].split(r'\"')[0]
        courseUrlSub = courseData[11].split(r'\":\"')[1].split(r'\"')[0]
        courseUrlSrc = courseData[12].split(r'\":\"')[1].split(r'\"')[0]
        courseIntroduceUrl = f"{courseUrlTitle + year + semester + courseUrlCls + courseUrlSub + courseUrlSrc}"

        if courseBlance < courseSum:
            data = {
                "id": count,
                "courseNumber": courseNumber,
                "courseName": courseName,
                "courseClass": courseClass,
                "courseDate": courseDate,
                "courseBalance": courseBlance,
                "courseSum": courseSum,
                "courseIntroduceUrl": courseIntroduceUrl
            }
            result.append(data)
            count += 1
    return result
