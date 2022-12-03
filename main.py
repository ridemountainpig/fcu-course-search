from flask import Flask, render_template
from script import courseSearch as cs

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generalstudies')
def generalstudies():
    return render_template('generalStudies.html', courseData=cs.getGeneralCourseList())


app.run(host='0.0.0.0', port=81)
