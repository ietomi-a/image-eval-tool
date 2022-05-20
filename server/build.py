from database import SessionLocal
from crud import create_image


__IMAGE_LIST = [
    "0.jpg", "1.jpg", "2.jpg",
    "3.jpg", "4.jpg", "5.jpg",
    "6.jpg", "7.jpg", "8.jpg", "9.jpg" ]


def build(image_list):
    db = SessionLocal()
    for fname in image_list:
        create_image(db, fname)
    db.commit()
    return


if __name__ == "__main__":
    build(__IMAGE_LIST)
