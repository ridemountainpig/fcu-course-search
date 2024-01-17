from flask import Flask, render_template, jsonify, request
from script import courseSearch as cs
from script import init
import os

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['DEBUG'] = True


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/searchcourse')
def searchCourse():
    return render_template('searchCourse.html')


@app.route('/followcourse')
def followCourse():
    return render_template('followCourse.html')


@app.route('/generalstudies')
def generalstudies():
    return render_template('generalStudies.html', courseData=cs.getGeneralCourseList())


@app.route('/searchcourse/<course>')
def searchCourseByCode(course):
    return cs.searchCourseByCode(course)


@app.route('/searchcourselist', methods=['POST'])
def searchCourseList():
    data = request.get_json()
    courseList = data['followList']
    return cs.searchCourseByCodeList(courseList)


@app.route('/checkcourse/<course>')
def checkCourse(course):
    if cs.searchCourseByCode(course) == "false":
        return "false"
    else:
        return "true"


@app.route('/getGeneralStudiesList')
def getGeneralStudiesList():
    return cs.getAppGeneralCourseList()


@app.route('/initYearAndSemester')
def initYearAndSemester():
    return init.getSystemYear()


@app.route('/sitemap.xml')
def sitemap():
    return app.send_static_file('assets/sitemap.xml')


@app.route('/manifest.json')
def manifest():
    return app.send_static_file('assets/manifest.json')


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=os.getenv("PORT", default=81))
