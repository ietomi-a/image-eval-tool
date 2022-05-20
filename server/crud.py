from sqlalchemy.orm import Session

import models


def get_image(db: Session, fname: str):
    return db.query(models.Image).filter(models.Image.fname == fname).first()


def get_images(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Image).offset(skip).limit(limit).all()


def create_image(db: Session, fname: str):
    db_image = models.Image(fname=fname)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image



    
