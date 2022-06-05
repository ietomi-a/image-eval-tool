from datetime import datetime, timedelta
from typing import Dict, Optional
from zoneinfo import ZoneInfo

from fastapi import Depends, HTTPException, status, Request
from fastapi.openapi.models import OAuthFlows as OAuthFlowsModel
from fastapi.security import OAuth2
from fastapi.security.utils import get_authorization_scheme_param
# from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, get_user, User


# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "516eeda1a8a989497749d6b772583cea5b7dbc0c0a5b408085593b581c8bf1e8"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
JST = ZoneInfo('Asia/Tokyo')


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


credentials_exception = HTTPException(
    # credential error が発生したら /login に飛ぶ.    
    status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    # status_code=status.HTTP_401_UNAUTHORIZED,    
    detail="Could not validate credentials",
    headers={ "Location": "/login?status=need_credential", "WWW-Authenticate": "Bearer" },
)

credentials_expired_exception = HTTPException(
    # credential error が発生したら /login に飛ぶ.    
    status_code=status.HTTP_307_TEMPORARY_REDIRECT,
    # status_code=status.HTTP_401_UNAUTHORIZED,    
    detail="credentials expired",
    headers={ "Location": "/login?status=credential_expired",
              "WWW-Authenticate": "Bearer" },
)


class OAuth2PasswordBearerWithCookie(OAuth2):
    def __init__(
        self,
        tokenUrl: str,
        scheme_name: Optional[str] = None,
        scopes: Optional[Dict[str, str]] = None,
        auto_error: bool = True,
    ):
        if not scopes:
            scopes = {}
        flows = OAuthFlowsModel(password={"tokenUrl": tokenUrl, "scopes": scopes})
        super().__init__(flows=flows, scheme_name=scheme_name, auto_error=auto_error)

    async def __call__(self, request: Request) -> Optional[str]:
        authorization: str = request.cookies.get("access_token")  #changed to accept access token from httpOnly Cookie
        # print("access_token is",authorization)

        scheme, param = get_authorization_scheme_param(authorization)
        if not authorization or scheme.lower() != "bearer":
            if self.auto_error:
                  raise credentials_exception
            else:
                return None
        return param



class Token(BaseModel):
    access_token: str
    token_type: str



oauth2_scheme = OAuth2PasswordBearerWithCookie(tokenUrl="/token")


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(username: str, password: str):
    db = next(get_db())
    user = get_user(db, username)
    if not user:
        return None, "user not eixts"
    if not verify_password(password, user.hashed_password):
        return None, "invalid password"
    return user, "ok"

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.now(tz=JST) + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        expire = payload.get("exp")
        expire = datetime.fromtimestamp(expire, tz=JST)
        # print("expire", expire)
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    db = next(get_db())
    user = get_user(db, username=username)
    if user is None:
        raise credentials_exception

    # check token expiration
    if expire is None:
        raise credentials_exception
    if datetime.now(tz=JST) > expire:
        raise credentials_expired_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
    

    