from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user as get_current_user_id, get_user_from_token
from app.models.cliente_model import PreferenciaCliente
from app.models.user_model import Usuario


def get_current_usuario(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)) -> Usuario:
    """Obtiene el usuario actual desde el token JWT"""
    if not authorization:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Token inválido")
    
    token = parts[1]
    user_id = get_user_from_token(token)
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token expirado o inválido")
    
    user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    return user

router = APIRouter(
    prefix="/api/preferencias-cliente",
    tags=["Preferencias"]
)


class PreferenciaCreate(BaseModel):
    id_cliente: int
    intereses: Optional[List[str]] = []
    compania: Optional[str] = None
    presupuesto: Optional[str] = None
    clima: Optional[str] = None
    ritmo: Optional[str] = None
    transporte: Optional[str] = None


class PreferenciaResponse(BaseModel):
    id_preferencia: int
    id_cliente: int
    intereses: Optional[List[str]] = []
    compania: Optional[str] = None
    presupuesto: Optional[str] = None
    clima: Optional[str] = None
    ritmo: Optional[str] = None
    transporte: Optional[str] = None

    class Config:
        from_attributes = True


@router.post("/", response_model=PreferenciaResponse, status_code=201)
def create_preferencia(data: PreferenciaCreate, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_usuario)):
    # Validar que el usuario está autenticado
    if not current_user:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    # Si el usuario no tiene id_cliente, rechazar
    if not current_user.id_cliente:
        raise HTTPException(status_code=400, detail="Debes completar tu perfil de cliente primero")
    
    # Validar que el id_cliente pertenece al usuario autenticado
    if current_user.id_cliente != data.id_cliente:
        raise HTTPException(status_code=403, detail="No tienes permiso para guardar preferencias de otro cliente")
    
    existente = db.query(PreferenciaCliente).filter(
        PreferenciaCliente.id_cliente == data.id_cliente
    ).first()
    if existente:
        # Actualiza si ya existe
        for key, value in data.dict(exclude={"id_cliente"}).items():
            setattr(existente, key, value)
        db.commit()
        db.refresh(existente)
        return existente

    preferencia = PreferenciaCliente(**data.dict())
    db.add(preferencia)
    db.commit()
    db.refresh(preferencia)
    return preferencia


@router.get("/{cliente_id}", response_model=PreferenciaResponse)
def get_preferencia(cliente_id: int, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_usuario)):
    # Validar que el usuario está autenticado
    if not current_user:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    preferencia = db.query(PreferenciaCliente).filter(
        PreferenciaCliente.id_cliente == cliente_id
    ).first()
    if not preferencia:
        raise HTTPException(status_code=404, detail="Preferencias no encontradas")
    return preferencia