import json
import os

from flask import Flask, jsonify, send_file, render_template, request
from flask_cors import CORS
from util import elo_rate, get_global_init_datas


app = Flask(
    __name__,
    template_folder="./build",  # index.html の置き場所.
    static_folder="./build/out",  # これを設定しないと、index.html から js ファイルをロードできない. 
)
CORS(app)  # 独立に js を動かすときは、これが必要.


def _generate_response(code:int, message:str):
    """ Generate a Flask response with a json playload and HTTP code  """
    return jsonify({'code': code, 'message': message}), code


@app.route('/')
def root_index():
    return render_template("index.html")


@app.route('/hello')
def hello_test():
    return jsonify({"my_data": "hello world"} )


@app.route('/images/<string:request_file>', methods=['GET'])
def image_request(request_file):
    path = os.path.join( "images", request_file)
    if os.path.exists(path):
       return send_file( path )
    return _generate_response( 404, "{} is not found".format(path) )


@app.route('/init_datas')
def init_datas():
    return jsonify(get_global_init_datas())

@app.route('/rating', methods=['POST'])
def rating_request():
    data = json.loads(request.get_data())
    win_rate, lose_rate = elo_rate(float(data["win"]["rate"]), float(data["lose"]["rate"]))
    return jsonify({ "win": { "fname": data["win"]["fname"], "rate": win_rate },
                     "lose": { "fname": data["lose"]["fname"], "rate": lose_rate } }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port="8080")
