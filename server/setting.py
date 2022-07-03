from zoneinfo import ZoneInfo

# to get a string like this run:
# openssl rand -hex 32
SECRET_KEY = "516eeda1a8a989497749d6b772583cea5b7dbc0c0a5b408085593b581c8bf1e8"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
JST = ZoneInfo('Asia/Tokyo')
