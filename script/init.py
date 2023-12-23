import requests
import json

s = requests.Session()

def getSystemYear():
    data = '{"lang":"cht"}'

    header = {
        "Content-Type": "application/json",
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36'
    }

    for i in range(1, 5):
        url = f"https://coursesearch0{i}.fcu.edu.tw/Service/Search.asmx/init"
        

        try:
            response = s.post(url, data=data, headers=header)
            response.raise_for_status()

            initData = response.text
            initData = json.loads(initData)
            year = initData["defaultYearSms"]["year"]
            semester = initData["defaultYearSms"]["sms"]
            print("Url", url)
            print("Year:", year)
            print("Semester:", semester)
            return {"url": url, "year": year, "semester": semester}

        except requests.exceptions.RequestException as e:
            # Handle request exceptions, such as connection errors or timeouts
            print("An error occurred during the request:", e)

        except (KeyError, ValueError) as e:
            # Handle JSON parsing errors or missing keys in the response
            print("Error parsing the response:", e)

    return {"year": None, "semester": None}