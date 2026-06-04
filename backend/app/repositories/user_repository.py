# repositories/user_repository.py

from sqlalchemy.orm import Session
from app.models.user_model import Usuario


def get_user_by_username(db: Session, username: str):
    return db.query(Usuario).filter(
        Usuario.username == username
    ).first()


def create_user(db: Session, user_data: dict):
    user = Usuario(**user_data)

    db.add(user)
    db.commit()
    db.refresh(user)

    return user