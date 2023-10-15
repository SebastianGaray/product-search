from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"status": "Hello from backend!"})

if __name__ == '__main__':
    app.run(debug=True)
