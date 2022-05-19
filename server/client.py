import json
import requests


def test_get_image():
    url = "http://0.0.0.0:8080/images/3.jpg"
    r = requests.get(url)
    print(r)
    print(dir(r))
    with open("tmp.jpg", "wb") as g:
        g.write(r.content)


def test_post_rating():
    url = "http://0.0.0.0:8080/rating"
    payload = { "win": { "fname": "images/3.jpg", "rate": 1500 },
                "lose": { "fname": "image/5.jpg", "rate": 1500 } }
    data = json.dumps(payload)
    r = requests.post(url, data=data)
    print(r)
    #print(dir(r))
    print(r.json())
    assert r.json() == {'lose': {'fname': 'image/5.jpg', 'rate': 1484.0}, 'win': {'fname': 'images/3.jpg', 'rate': 1516.0}}





test_post_rating()
