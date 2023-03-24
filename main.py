from flask import Flask, render_template, jsonify
from script import courseSearch as cs
from script import init
import os

app = Flask(__name__)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['DEBUG'] = True

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/getCourse/<course>')
def getCourse(course):
    return cs.getCourseByCode(course)

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

@app.route('/checkcourse/<course>')
def checkCourse(course):
    return cs.checkCourse(course)

@app.route('/getGeneralStudiesList')
def getGeneralStudiesList():
    return cs.getAppGeneralCourseList()

@app.route('/GITPULL')
def gitPull():
    os.system('git pull')
    return "Git Pull Success"

@app.route('/initYearAndSemester')
def initYearAndSemester():
    return init.getSystemYear()

if __name__ == '__main__': 
    app.run(host='0.0.0.0', port=81)