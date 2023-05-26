import requests
import json

s = requests.Session()

def getSystemYear():
    data = '{"lang":"cht"}'

    header = {
        "Content-Type": "application/json",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }

    primary_url = "https://coursesearch03.fcu.edu.tw/Service/Search.asmx/init"
    backup_url = "https://coursesearch02.fcu.edu.tw/Service/Search.asmx/init"

    try:
        response = s.post(primary_url, data=data, headers=header)
        response.raise_for_status()

        initData = response.text.replace("\\", "")
        initData = initData[6:-2]
        initData = json.loads(initData)
        year = initData["defaultYearSms"]["year"]
        semester = initData["defaultYearSms"]["sms"]
        print("Year:", year)
        print("Semester:", semester)
        return {"year": year, "semester": semester}

    except requests.exceptions.RequestException as e:
        # Handle request exceptions, such as connection errors or timeouts
        print("An error occurred during the request:", e)

    except (KeyError, ValueError) as e:
        # Handle JSON parsing errors or missing keys in the response
        print("Error parsing the response:", e)

    try:
        response = s.post(backup_url, data=data, headers=header)
        response.raise_for_status()

        initData = response.text.replace("\\", "")
        initData = initData[6:-2]
        initData = json.loads(initData)
        year = initData["defaultYearSms"]["year"]
        semester = initData["defaultYearSms"]["sms"]
        print("Year:", year)
        print("Semester:", semester)
        return {"year": year, "semester": semester}

    except requests.exceptions.RequestException as e:
        print("An error occurred during the request to the fallback URL:", e)

    except (KeyError, ValueError) as e:
        print("Error parsing the response from the fallback URL:", e)

    return None