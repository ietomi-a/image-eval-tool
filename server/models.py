from sqlalchemy import Column, Float, Integer, String

from database import Base, engine


class Image(Base):
    __tablename__ = "images"
    
    fname = Column(String, primary_key=True, index=True)
    win = Column(Integer, default=0)
    lose = Column(Integer, default=0)
    rate = Column(Float, default=1500)


# create_allは一度実行すると二回目以降は実行されない。
Base.metadata.create_all(bind=engine)
    
