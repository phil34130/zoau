from flask import Flask
from flask import request
from zoautil_py import datasets
app = Flask(__name__)


@app.route('/')
def get_dataset():
    dataset = request.args.get('dataset')
    if dataset:
        return datasets.read(dataset)
    else:
        return datasets.read("PRICHAR.FLASK")

if __name__ == '__main__':
    app.run(host='0.0.0.0')
