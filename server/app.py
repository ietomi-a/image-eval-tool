from fastapi import FastAPI, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

# from starlette.middleware.cors import CORSMiddleware

import apis
from authenticate import get_current_active_user
from database import User


app = FastAPI()
app.include_router(apis.router)

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
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/register_page", response_class=HTMLResponse)
async def register_page(request: Request):
    return templates.TemplateResponse(
        "register.html", {"request": request } )


@app.get("/login", response_class=HTMLResponse)
async def login( request: Request):
    return templates.TemplateResponse("login.html", {"request": request} )


@app.get("/upload_page", response_class=HTMLResponse)
async def upload_page(
        request: Request,
        current_user: User = Depends(get_current_active_user)):
    return templates.TemplateResponse("upload.html", {"request": request})



if __name__ == "__main__":
    import uvicorn
    # 0.0.0.0 でないと cookie が保存されない。(loalhost, 127.0.0.1 などだとなぜか cookie が保存できない)
    uvicorn.run(app, host="0.0.0.0", port=8080)
    # uvicorn.run(app, host="localhost", port=8080)    
