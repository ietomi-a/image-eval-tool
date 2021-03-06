from collections import OrderedDict
from datetime import timedelta
import os

from fastapi import APIRouter, Depends, Form, Response, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from authenticate import ACCESS_TOKEN_EXPIRE_MINUTES, get_password_hash, authenticate_user, create_access_token, get_current_active_user
from database import get_db, get_images, get_image, get_user, User, create_user, create_image, get_datasets, DEFAULT_USER, DEFAULT_IMAGE_SET
from rating import elo_rate, RateDataPair


router = APIRouter()

IMAGE_DIR = "images"


@router.get('/init_datas', response_class=JSONResponse)
async def init_datas(
        datasetType="default",
        dataset:str = DEFAULT_IMAGE_SET,
        current_user: User = Depends(get_current_active_user) ):
    db = next(get_db())
    if datasetType == "default":
        username = DEFAULT_USER
    else:
        username = current_user.username
    images = get_images(db, username=username, imageset=dataset)
    datas = OrderedDict()
    for image in images:
        fpath = os.path.join("userimages", username, dataset, image.fname)
        datas[fpath] = { "win": image.win, "lose": image.lose, "rate": image.rate }
    return datas


@router.get("/user_dataset", response_class=JSONResponse)
async def user_dataset(current_user: User = Depends(get_current_active_user)):
    db = next(get_db())
    datasets = get_datasets(db, username=current_user.username)
    return datasets


@router.get('/userimages/{username}/{dataset}/{request_file}', response_class=FileResponse)
async def userimage_request(
        username: str,
        dataset: str,
        request_file: str,
        current_user: User = Depends(get_current_active_user) ):
    base_username = os.path.basename(username)     
    base_dataset = os.path.basename(dataset)    
    basename = os.path.basename(request_file)
    path = os.path.join(IMAGE_DIR, base_username, base_dataset, basename)
    return path


@router.post('/rating', response_model=RateDataPair)
async def rating_request(
        data: RateDataPair,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_active_user) ):
    if data.datasetType == "default":
        username = DEFAULT_USER
    else:
        username = current_user.username
        
    winner = get_image(db, os.path.basename(data.win.fname),
                       username=username, imageset=data.dataset)
    loser = get_image(db, os.path.basename(data.lose.fname),
                      username=username, imageset=data.dataset)
    winner_rate, loser_rate = elo_rate(winner.rate, loser.rate)
    winner.win += 1
    winner.rate = winner_rate
    loser.lose += 1
    loser.rate = loser_rate
    db.commit()
    return {
        "datasetType": data.datasetType,
        "dataset": data.dataset,        
        "win": { "fname": data.win.fname, "rate": winner_rate },
        "lose": { "fname": data.lose.fname, "rate": loser_rate }
    }


@router.post("/register")
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


@router.post("/token")
async def login_for_access_token(
        response: Response,
        form_data: OAuth2PasswordRequestForm = Depends()):
    # python-multipart ????????????????????????????????????.
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
    response.set_cookie(
        key="username",
        value=f"{user.username}",
        httponly=False, # javascript ?????? username ?????????????????????????????????????????????????????????????????????????????????????????????.
        # secure=True,
        samesite="Strict"
    )
    return { "status": message }


@router.post("/upload", response_class=JSONResponse)
async def upload(file: UploadFile,
                 dataset: str = Form(...),
                 current_user: User = Depends(get_current_active_user) ):
    base_username = os.path.basename(current_user.username)
    basename = os.path.basename(file.filename)
    dataset = os.path.basename(dataset)
    # print(dataset)
    dirname = os.path.join(IMAGE_DIR, base_username, dataset)
    fpath = os.path.join(dirname, basename)
    body = await file.read()

    if not os.path.exists(dirname):
        os.makedirs(dirname)
    with open(fpath, "wb") as f:
        f.write(body)

    db = next(get_db())
    create_image(db, fname=basename, username=base_username, imageset=dataset)
    return {"status": "ok"}



