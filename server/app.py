import os
from collections import OrderedDict

from fastapi import FastAPI, Request, Depends
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel
from sqlalchemy.orm import Session
import uvicorn
# from starlette.middleware.cors import CORSMiddleware


import crud
from database import get_db
import models
from schemas import RateDataPair
from util import elo_rate


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
async def init_datas(db: Session = Depends(get_db)):
    images = crud.get_images(db)
    ret = OrderedDict()
    for image in images:
        fpath = "images/" + image.fname
        ret[fpath] = { "win": image.win, "lose": image.lose, "rate": image.rate }
    return ret
        

@app.get('/images/{request_file}', response_class=FileResponse)
async def image_request(request_file: str):
    path = os.path.join( "images", request_file)
    return path


@app.post('/rating', response_model=RateDataPair)
def rating_request(data: RateDataPair, db: Session = Depends(get_db)):
    # print(data)
    winner = crud.get_image(db, os.path.basename(data.win.fname))
    loser = crud.get_image(db, os.path.basename(data.lose.fname))
    winner_rate, loser_rate = elo_rate(winner.rate, loser.rate)
    winner.win += 1
    winner.rate = winner_rate
    loser.lose += 1
    loser.rate = loser_rate
    db.commit()
    return { "win": { "fname": data.win.fname, "rate": winner_rate },
             "lose": { "fname": data.lose.fname, "rate": loser_rate } }


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8080)
