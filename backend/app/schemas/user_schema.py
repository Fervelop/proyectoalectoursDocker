# schemas/user_schema.py

from pydantic import BaseModel, EmailStr


class UsuarioCreate(BaseModel):
    username: str
    correo_electronico: EmailStr
    password: str


class UsuarioLogin(BaseModel):
    username: str
    password: str


class UsuarioResponse(BaseModel):
    id_usuario: int
    username: str
    correo_electronico: str

    class Config:
        from_attributes = True