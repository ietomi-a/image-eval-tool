import os

import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
# from starlette.middleware.cors import CORSMiddleware

from util import elo_rate, get_global_init_datas

app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=['*'],
#     allow_credentials=True,
#     allow_methods=['*'],
#     allow_headers=['*']
# )
app.mount("/build", StaticFiles(directory="build"), name="build")
templates = Jinja2Templates(directory="build")
app.mount("/out", StaticFiles(directory="build/out"), name="out")


@app.get("/", response_class=HTMLResponse)
async def root_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request} )


@app.get('/init_datas', response_class=JSONResponse)
def init_datas():
    return get_global_init_datas()


@app.get('/images/{request_file}', response_class=FileResponse)
async def image_request(request_file: str):
    path = os.path.join( "images", request_file)
    return path


class RateData(BaseModel):
    fname: str
    rate: float


class RateDataPair(BaseModel):
    win: RateData
    lose: RateData


@app.post('/rating', response_class=JSONResponse)
def rating_request(data: RateDataPair):
    win_rate, lose_rate = elo_rate(data.win.rate, data.lose.rate)
    return { "win": { "fname": data.win.fname, "rate": win_rate },
             "lose": { "fname": data.lose.fname, "rate": lose_rate } }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
