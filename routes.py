from flask import Flask, render_template

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('home.html')


@app.route('/time', methods=['GET', ])
def time():
    return render_template('time.html')

if __name__ == '__main__':
    app.run()
