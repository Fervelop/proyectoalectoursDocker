# Quick Start - AlecTours Backend

Guía paso a paso para empezar a desarrollar en 5 minutos.

## 1️⃣ Setup Inicial

```bash
cd proyecto-be-fe-alectours

# Levantar contenedores
docker compose up -d

# Crear BD
docker compose exec postgres psql -U admin -c "CREATE DATABASE alektours_db;"
```

**Verificar:**
- API: http://localhost:8000/docs
- PgAdmin: http://localhost:5050
- Mailpit: http://localhost:8025

## 2️⃣ Configurar Proyecto

```bash
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Verificar setup
python verify_setup.py

# Ejecutar migraciones
alembic upgrade head
```

## 3️⃣ Crear Primer Modelo

`app/models/user.py`:
```python
from sqlalchemy import Column, Integer, String, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    nombre = Column(String)
    contraseña = Column(String)
    activo = Column(Boolean, default=True)
```

## 4️⃣ Crear Schema Pydantic

`app/schemas/user.py`:
```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    nombre: str
    contraseña: str

class UserResponse(BaseModel):
    id: int
    email: str
    nombre: str
    
    class Config:
        from_attributes = True
```

## 5️⃣ Crear Primera Ruta

`app/routes/auth.py`:
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, generate_token_pair
from app.core.mail import send_welcome_email
from app.models.user import User
from app.schemas.user import UserCreate

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
async def register(user_data: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="Email ya existe")
    
    new_user = User(
        email=user_data.email,
        nombre=user_data.nombre,
        contraseña=hash_password(user_data.contraseña)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    await send_welcome_email(user_data.email, user_data.nombre)
    
    return {
        "user": {
            "id": new_user.id,
            "email": new_user.email,
            "nombre": new_user.nombre
        },
        **generate_token_pair(new_user.id)
    }
```

## 6️⃣ Registrar Ruta en main.py

`app/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.auth import router as auth_router

app = FastAPI(title="AlecTours API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

@app.get("/")
async def root():
    return {"message": "AlecTours API"}
```

## 7️⃣ Crear Migración

```bash
alembic revision --autogenerate -m "Create user table"
alembic upgrade head
```

## 8️⃣ Probar

```bash
# Terminal 1: Iniciar servidor
uvicorn app.main:app --reload

# Terminal 2: Probar
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","nombre":"Juan","contraseña":"pass123"}'
```

✅ Email de bienvenida en http://localhost:8025

---

## 📚 Próximos Pasos

- [BEST_PRACTICES.md](BEST_PRACTICES.md) — Cómo escribir código de calidad
- [CORE_README.md](CORE_README.md) — Documentación del core (security, mail, db)
- [DATABASE.md](DATABASE.md) — Trabajar con la BD
- [DEPLOYMENT.md](DEPLOYMENT.md) — Ir a producción

---

## ⚡ Funciones Clave

### Security
```python
from app.core.security import (
    hash_password,          # Hashear contraseña
    verify_password,        # Verificar contraseña
    generate_token_pair,    # Crear tokens JWT
    get_user_from_token,    # Extraer user_id del token
)
```

### Mail
```python
from app.core.mail import (
    send_welcome_email,              # Bienvenida
    send_verification_email,         # Verificación
    send_password_reset_email,       # Reset password
    send_reservation_confirmation,   # Confirmación de reserva
    send_cancellation_email,         # Cancelación
)
```

---

**¡Listo! Ahora puedes empezar a desarrollar 🚀**
