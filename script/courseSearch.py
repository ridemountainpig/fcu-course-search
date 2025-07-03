import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

s = requests.Session()

# system year
year = os.getenv('YEAR')
semester = os.getenv('SEMESTER')

header = {
    "Content-Type":
        "application/json",
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
}

courseUrlTitle = "https://coursesearch02.fcu.edu.tw/CourseOutline.aspx?lang=cht&courseid="


def make_robust_request(data, timeout=10):
    response = None
    last_error = None

    for i in range(3, 5):
        try:
            response = s.post(
                f"https://coursesearch0{i}.fcu.edu.tw/Service/Search.asmx/GetType2Result",
                data=data,
                headers=header,
                timeout=timeout
            )
            if response.status_code == 200 and response.text:
                try:
                    data = json.loads(response.text)
                    return True, data, None
                except json.JSONDecodeError as e:
                    last_error = f"Response format error, cannot parse JSON: {e}"
                    continue
        except (requests.exceptions.RequestException, requests.exceptions.Timeout,
                requests.exceptions.ConnectionError) as e:
            last_error = f"Try server {i} failed: {e}"
            print(last_error)
            continue

    error_msg = last_error or "All servers failed to respond"
    print(error_msg)
    return False, None, error_msg


def searchCourseByCode(courseCode):
    data = '''
        {
            "baseOptions": {
                "lang": "cht",
                "year": ''' + year + ''',
                "sms": ''' + semester + '''
            },
            "typeOptions": {
                "code": {
                "enabled": true,
                "value": "''' + str(courseCode) + '''"
                },
                "weekPeriod": {
                "enabled": false,
                "week": "*",
                "period": "*"
                },
                "course": {
                "enabled": false,
                "value": ""
                },
                "teacher": {
                "enabled": false,
                "value": ""
                },
                "useEnglish": {
                "enabled": false
                },
                "useLanguage": {
                "enabled": false,
                "value": "01"
                },
                "specificSubject": {
                "enabled": false,
                "value": "1"
                },
                "courseDescription": {
                "enabled": false,
                "value": ""
                }
            }
        }
    '''

    success, response, error = make_robust_request(data)
    if not success:
        return "false"

    courseList = response
    if courseList["total"] == 0:
        return "false"
    else:
        courseData = byCodeCourseListToDict(courseList["items"])
        return courseData


def searchCourseByCodeList(courseList):
    courseData = {}
    for course in courseList:
        if course == "":
            continue
        data = searchCourseByCode(course)
        if data == "false":
            courseData[len(courseData)] = "false"
        else:
            courseData[len(courseData)] = data[0]
    return courseData


generalStudiesData = '''
    {
        "baseOptions": {
            "lang": "cht",
            "year": ''' + year + ''',
            "sms": ''' + semester + '''
        },
        "typeOptions": {
            "code": {
            "enabled": false,
            "value": ""
            },
            "weekPeriod": {
            "enabled": false,
            "week": "*",
            "period": "*"
            },
            "course": {
            "enabled": false,
            "value": ""
            },
            "teacher": {
            "enabled": false,
            "value": ""
            },
            "useEnglish": {
            "enabled": false
            },
            "useLanguage": {
            "enabled": false,
            "value": "01"
            },
            "specificSubject": {
            "enabled": true,
            "value": "1"
            },
            "courseDescription": {
            "enabled": false,
            "value": ""
            }
        }
    }
'''


def getGeneralCourseList():
    success, response, error = make_robust_request(generalStudiesData)
    if not success:
        return {}

    courseList = response
    return courseListToDict(courseList['items'])


def getAppGeneralCourseList():
    success, response, error = make_robust_request(generalStudiesData)
    if not success:
        return []

    courseList = response
    return appCourseListToDict(courseList["items"])


def byCodeCourseListToDict(courseList):
    result = {}
    count = 0

    for i in range(len(courseList)):
        courseNumber = courseList[i]["scr_selcode"]
        courseName = courseList[i]["sub_name"]
        courseClass = courseList[i]["cls_name"]
        courseDate = []
        for j in courseList[i]["scr_period"].split(' ')[:-1]:
            if j != '':
                courseDate.append(j)
        courseDate = ' '.join(courseDate)
        courseTeacher = courseList[i]["scr_period"].split(' ')[-1]
        courseSum = courseList[i]["scr_precnt"]
        courseBlance = courseList[i]["scr_acptcnt"]
        courseUrlCls = courseList[i]["cls_id"]
        courseUrlSub = courseList[i]["sub_id"]
        courseUrlSrc = courseList[i]["scr_dup"]
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
    for i in range(len(courseList)):
        courseNumber = courseList[i]["scr_selcode"]
        courseName = courseList[i]["sub_name"]
        courseClass = courseList[i]["cls_name"]
        courseDate = []
        for j in courseList[i]["scr_period"].split(' ')[:-1]:
            if j != '':
                courseDate.append(j)
        courseDate = ' '.join(courseDate)
        courseSum = courseList[i]["scr_precnt"]
        courseBlance = courseList[i]["scr_acptcnt"]
        courseUrlCls = courseList[i]["cls_id"]
        courseUrlSub = courseList[i]["sub_id"]
        courseUrlSrc = courseList[i]["scr_dup"]
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
    for i in range(len(courseList)):
        courseNumber = courseList[i]["scr_selcode"]
        courseName = courseList[i]["sub_name"]
        courseClass = courseList[i]["cls_name"]
        courseDate = []
        for j in courseList[i]["scr_period"].split(' ')[:-1]:
            if j != '':
                courseDate.append(j)
        courseDate = ' '.join(courseDate)
        courseTeacher = courseList[i]["scr_period"].split(' ')[-1]
        courseSum = courseList[i]["scr_precnt"]
        courseBlance = courseList[i]["scr_acptcnt"]
        courseUrlCls = courseList[i]["cls_id"]
        courseUrlSub = courseList[i]["sub_id"]
        courseUrlSrc = courseList[i]["scr_dup"]
        courseIntroduceUrl = f"{courseUrlTitle + year + semester + courseUrlCls + courseUrlSub + courseUrlSrc}"

        if courseBlance < courseSum:
            data = {
                "id": count,
                "courseNumber": courseNumber,
                "courseName": courseName,
                "courseClass": courseClass,
                "courseDate": courseDate,
                "courseTeacher": courseTeacher,
                "courseBalance": courseBlance,
                "courseSum": courseSum,
                "courseIntroduceUrl": courseIntroduceUrl
            }
            result.append(data)
            count += 1
    return result
