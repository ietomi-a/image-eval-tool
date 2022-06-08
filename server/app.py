from collections import OrderedDict
from datetime import timedelta
import os
from typing import Union

from fastapi import Cookie, FastAPI, Request, Response, Depends, HTTPException, status
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session

# from starlette.middleware.cors import CORSMiddleware

from authenticate import ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash, authenticate_user, create_access_token, get_current_active_user, Token
from database import get_db, get_images, get_image, get_user, User, create_user
from rating import elo_rate, RateDataPair


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
async def root_index(
        request: Request,
        current_user: User = Depends(get_current_active_user)):
    return templates.TemplateResponse("index.html", {"request": request, "user": current_user.username } )


@app.get('/init_datas', response_class=JSONResponse)
async def init_datas(current_user: User = Depends(get_current_active_user) ):
    db = next(get_db())
    images = get_images(db)
    ret = OrderedDict()
    for image in images:
        fpath = "images/" + image.fname
        ret[fpath] = { "win": image.win, "lose": image.lose, "rate": image.rate }
    return ret


@app.get('/images/{request_file}', response_class=FileResponse)
async def image_request(
        request_file: str,
        current_user: User = Depends(get_current_active_user) ):
    path = os.path.join( "images", "global", request_file)
    return path


@app.post('/rating', response_model=RateDataPair)
async def rating_request(
        data: RateDataPair,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user) ):        
    # print(data)
    winner = get_image(db, os.path.basename(data.win.fname))
    loser = get_image(db, os.path.basename(data.lose.fname))
    winner_rate, loser_rate = elo_rate(winner.rate, loser.rate)
    winner.win += 1
    winner.rate = winner_rate
    loser.lose += 1
    loser.rate = loser_rate
    db.commit()
    return { "win": { "fname": data.win.fname, "rate": winner_rate },
             "lose": { "fname": data.lose.fname, "rate": loser_rate } }



@app.get("/register_page", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse(
        "register.html", {"request": request } )


@app.post("/register")
async def register( response: Response,
                    form_data: OAuth2PasswordRequestForm = Depends()):    
    hashed_password = get_password_hash(form_data.password)
    db = next(get_db())
    user = get_user(db, form_data.username)
    if not user:
        do_user = create_user(
            db=db,
            username=form_data.username,
            hashed_password=hashed_password)
        db.commit()
        return {"status": "ok"}
    else:
        return {"status": "ng"}


@app.get("/login", response_class=HTMLResponse)
async def login( request: Request, status: str = "normal"):
    message = ""
    if status == "need_credential":
        message = "you need login for using application"
    elif status == "credential_expired":
        message = "your credential is expired"
    return templates.TemplateResponse(
        "login.html", {"request": request, "message": message } )


@app.post("/token")
async def login_for_access_token(
        response: Response,
        form_data: OAuth2PasswordRequestForm = Depends()):
    # python-multipart がないと動かないので注意.
    user, message = authenticate_user(form_data.username, form_data.password)
    if not user:
        # print("message = ", message)
        return { "status": message }
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        # secure=True,
        samesite="Strict"
    )
    return { "status": message }



if __name__ == "__main__":
    import uvicorn
    # 0.0.0.0 でないと cookie が保存されない。(loalhost, 127.0.0.1 などだとなぜか cookie が保存できない)
    uvicorn.run(app, host="0.0.0.0", port=8080)
    # uvicorn.run(app, host="localhost", port=8080)    
