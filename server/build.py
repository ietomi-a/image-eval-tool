from database import SessionLocal, create_image, create_user


__IMAGE_LIST = [
    "0.jpg", "1.jpg", "2.jpg",
    "3.jpg", "4.jpg", "5.jpg",
    "6.jpg", "7.jpg", "8.jpg", "9.jpg" ]


def build(image_list):
    db = SessionLocal()
    for fname in image_list:
        create_image(db, fname)

    # hash_password は "secret" を hash 化した値.
    user_dict = {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        "disabled": False,
    }
    create_user(db, **user_dict)
    db.commit()
    return


if __name__ == "__main__":
    build(__IMAGE_LIST)
