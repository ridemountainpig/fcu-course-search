from flask import Flask, render_template
from script import courseSearch as cs

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('result.html', data=cs.getCourse())


app.run(host='0.0.0.0', port=81)
