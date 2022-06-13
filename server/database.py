from sqlalchemy import create_engine, Column, Float, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session


DEFAULT_USER = "default"
DEFAULT_IMAGE_SET = "default"

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Image(Base):
    __tablename__ = "images"
    
    username = Column(String, default=DEFAULT_USER, primary_key=True)
    imageset = Column(String, default=DEFAULT_IMAGE_SET, primary_key=True)
    fname = Column(String, primary_key=True)
    win = Column(Integer, default=0)
    lose = Column(Integer, default=0)
    rate = Column(Float, default=1500)


class User(Base):
    __tablename__ = "users"
    
    username = Column(String, primary_key=True, index=True)
    hashed_password = Column(String)
    email = Column(String, default=None)
    full_name = Column(String, default=None)
    disabled = Column(Boolean, default=False)
    

# create_allは一度実行すると二回目以降は実行されない。
Base.metadata.create_all(bind=engine)
    

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_user(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()


def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()


def create_user(
        db: Session,
        username: str,
        hashed_password: str,
        email: str = None,
        full_name: str = None,
        disabled: bool = False ):
    db_user = User(
        username=username,
        hashed_password=hashed_password,
        email=email,
        full_name=full_name,
        disabled=disabled,
    )
    db.add(db_user)
    db.commit()
    return db_user


def get_image(db: Session, fname: str,
              username:str = DEFAULT_USER, imageset:str = DEFAULT_IMAGE_SET):
    print("in get_image, username =", username)
    return db.query(Image).filter(
        Image.fname == fname
        ,Image.username == username
        ,Image.imageset == imageset
    ).first()


def get_images(db: Session,
               username:str = DEFAULT_USER, imageset:str = DEFAULT_IMAGE_SET,
               skip: int = 0, limit: int = 100):
    return db.query(Image).filter(
        Image.username == username
        ,Image.imageset == imageset
    ).offset(skip).limit(limit).all()


def create_image(db: Session, fname: str,
                 username:str = DEFAULT_USER, imageset:str = DEFAULT_IMAGE_SET):
    db_image = Image(fname=fname, username=username, imageset=imageset)
    db.add(db_image)
    db.commit()
    return db_image
        
