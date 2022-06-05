from sqlalchemy import create_engine, Column, Float, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session


SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Image(Base):
    __tablename__ = "images"
    
    fname = Column(String, primary_key=True, index=True)
    win = Column(Integer, default=0)
    lose = Column(Integer, default=0)
    rate = Column(Float, default=1500)


class User(Base):
    __tablename__ = "users"
    
    username = Column(String, primary_key=True, index=True)
    hashed_password  = Column(String)
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


def get_image(db: Session, fname: str):
    return db.query(Image).filter(Image.fname == fname).first()


def get_images(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Image).offset(skip).limit(limit).all()


def create_image(db: Session, fname: str):
    db_image = Image(fname=fname)
    db.add(db_image)
    db.commit()
    return db_image
        