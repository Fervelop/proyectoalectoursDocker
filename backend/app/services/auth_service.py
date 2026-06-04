# services/auth_service.py

from sqlalchemy.orm import Session

from app.repositories.user_repository import (
    get_user_by_username,
    create_user
)

from app.core.security import (
    hash_password,
    verify_password,
    generate_token_pair
)


def login_user(db: Session, username: str, password: str):

    user = get_user_by_username(db, username)

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None

    return generate_token_pair(user.id_usuario)