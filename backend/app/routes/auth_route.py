# routes/auth_route.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.user_schema import UsuarioLogin

from app.services.auth_service import login_user

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/login")
def login(data: UsuarioLogin, db: Session = Depends(get_db)):

    tokens = login_user(
        db,
        data.username,
        data.password
    )

    if not tokens:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )

    return tokens