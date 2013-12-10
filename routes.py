from flask import Flask, render_template

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def home():
	return render_template('home.html')

@app.route('/top_complaints.csv', methods=['GET'])
def top_complaints():
	return open("top_complaints.csv").read()

if __name__ == '__main__':
    app.run()

