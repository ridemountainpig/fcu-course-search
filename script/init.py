import requests
import json

s = requests.Session()


def getSystemYear():
    data = '{"lang":"cht"}'

    header = {
        "Content-Type":
        "application/json",
        'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }

    response = s.post(
        "https://coursesearch03.fcu.edu.tw/Service/Search.asmx/init",
        data=data,
        headers=header,
    )

    initData = (response.text.replace("\\", ""))
    initData = initData[6:-2]
    initData = json.loads(initData)
    year = initData["defaultYearSms"]["year"]
    semester = initData["defaultYearSms"]["sms"]
    return {"year": year, "semester": semester}
