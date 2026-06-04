# Core Modules - security.py, mail.py, database.py, config.py

Documentación completa de los módulos centralizados del core.

---

## 🔐 security.py - Autenticación y Hashing

### Funciones

#### `hash_password(password: str) -> str`
Hashea una contraseña con bcrypt.

```python
from app.core.security import hash_password

hashed = hash_password("password123")
# bcrypt$2b$12$...
```

#### `verify_password(plain_password: str, hashed_password: str) -> bool`
Verifica una contraseña contra su hash.

```python
from app.core.security import verify_password

is_valid = verify_password("password123", hashed_password)
# True o False
```

#### `create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str`
Crea un JWT token de acceso (válido 30 min por defecto).

```python
from app.core.security import create_access_token

token = create_access_token(data={"sub": "123"})
# eyJhbGc...
```

#### `create_refresh_token(data: dict) -> str`
Crea un JWT token de refresco (válido 7 días).

```python
from app.core.security import create_refresh_token

token = create_refresh_token(data={"sub": "123"})
# eyJhbGc...
```

#### `decode_token(token: str) -> Optional[dict]`
Decodifica y valida un JWT token.

```python
from app.core.security import decode_token

payload = decode_token(token)
# {"sub": "123", "exp": 1234567890} o None si inválido
```

#### `get_user_from_token(token: str) -> Optional[int]`
Extrae el user_id de un token válido.

```python
from app.core.security import get_user_from_token

user_id = get_user_from_token(token)
# 123 o None si inválido
```

#### `generate_token_pair(user_id: int) -> dict`
Genera access_token + refresh_token.

```python
from app.core.security import generate_token_pair

tokens = generate_token_pair(user_id=456)
# {
#   "access_token": "eyJ...",
#   "refresh_token": "eyJ...",
#   "token_type": "bearer"
# }
```

---

## 📧 mail.py - Envío de Emails

### Funciones

#### `send_email(email: str, subject: str, body: str, html_body: Optional[str] = None) -> bool`
Envía un email genérico.

```python
from app.core.mail import send_email

success = await send_email(
    email="user@example.com",
    subject="Hola",
    body="Este es el cuerpo",
    html_body="<h1>Este es HTML</h1>"
)
```

#### `send_welcome_email(email: str, name: str) -> bool`
Email de bienvenida.

```python
from app.core.mail import send_welcome_email

await send_welcome_email("user@example.com", "Juan")
```

#### `send_verification_email(email: str, verification_token: str, base_url: str) -> bool`
Email con enlace de verificación.

```python
from app.core.mail import send_verification_email

await send_verification_email(
    email="user@example.com",
    verification_token="jwt_token",
    base_url="http://localhost:3000"
)
```

#### `send_password_reset_email(email: str, reset_token: str, base_url: str) -> bool`
Email para resetear contraseña.

```python
from app.core.mail import send_password_reset_email

await send_password_reset_email(
    email="user@example.com",
    reset_token="jwt_token",
    base_url="http://localhost:3000"
)
```

#### `send_reservation_confirmation(...) -> bool`
Confirmación de reserva con detalles.

```python
from app.core.mail import send_reservation_confirmation

await send_reservation_confirmation(
    email="guest@example.com",
    reservation_id=123,
    hotel_name="Hotel Paradise",
    check_in="2026-06-10",
    check_out="2026-06-15",
    total_price=500.00,
    guest_name="Juan Pérez"
)
```

#### `send_cancellation_email(email: str, reservation_id: int, guest_name: str, refund_amount: Optional[float]) -> bool`
Confirmación de cancelación.

```python
from app.core.mail import send_cancellation_email

await send_cancellation_email(
    email="guest@example.com",
    reservation_id=123,
    guest_name="Juan Pérez",
    refund_amount=400.00
)
```

---

## 🗄️ database.py - SQLAlchemy ORM

### Componentes

#### `engine`
Motor SQLAlchemy configurado con la BD.

```python
from app.core.database import engine

# No necesitas usarlo directamente
```

#### `SessionLocal`
Factory de sesiones.

```python
from app.core.database import SessionLocal

db = SessionLocal()
users = db.query(User).all()
db.close()
```

#### `Base`
Clase base para todos los modelos ORM.

```python
from app.core.database import Base

class User(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True)
    email = Column(String)
```

#### `get_db()`
Dependencia FastAPI para inyectar sesión automáticamente.

```python
from app.core.database import get_db
from sqlalchemy.orm import Session

@router.get("/users")
async def list_users(db: Session = Depends(get_db)):
    users = db.query(User).all()
    return users
```

---

## ⚙️ config.py - Variables de Entorno

### Variables

```python
from app.core.config import settings

settings.DATABASE_URL          # postgresql+psycopg://...
settings.SECRET_KEY            # Clave JWT
settings.ALGORITHM             # HS256
settings.ACCESS_TOKEN_EXPIRE_MINUTES  # 30
settings.MAIL_USERNAME         # Email SMTP
settings.MAIL_PASSWORD         # Password SMTP
settings.MAIL_FROM             # noreply@alectours.com
settings.MAIL_PORT             # 1025 (mailpit) o 587/465
settings.MAIL_SERVER           # mailpit, smtp.gmail.com, etc
settings.MAIL_FROM_NAME        # AlecTours
settings.MAIL_STARTTLS         # False
settings.MAIL_SSL_TLS          # False
```

Todas estas variables se cargan del archivo `.env`.

---

## 📚 Ejemplos de Uso Completos

### Ejemplo 1: Autenticación Completa

```python
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    hash_password,
    verify_password,
    generate_token_pair,
    get_user_from_token
)
from app.models.user import User

router = APIRouter()
security = HTTPBearer()

# Dependencia para obtener usuario actual
async def get_current_user(
    credentials: HTTPAuthCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    user_id = get_user_from_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user

# Registro
@router.post("/register")
async def register(email: str, password: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email exists")
    
    user = User(email=email, password=hash_password(password))
    db.add(user)
    db.commit()
    
    return generate_token_pair(user.id)

# Login
@router.post("/login")
async def login(email: str, password: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return generate_token_pair(user.id)

# Ruta protegida
@router.get("/me")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "email": current_user.email
    }
```

### Ejemplo 2: Envío de Emails en Ruta

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.mail import send_reservation_confirmation

@router.post("/reservas")
async def create_reservation(
    hotel_id: int,
    check_in: str,
    check_out: str,
    total_price: float,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Crear reserva
    reservation = Reservation(
        user_id=current_user.id,
        hotel_id=hotel_id,
        check_in=check_in,
        check_out=check_out,
        total_price=total_price,
        status="confirmada"
    )
    db.add(reservation)
    db.commit()
    
    # Enviar email (no esperar)
    import asyncio
    asyncio.create_task(send_reservation_confirmation(
        email=current_user.email,
        reservation_id=reservation.id,
        hotel_name="Hotel Paradise",
        check_in=check_in,
        check_out=check_out,
        total_price=total_price,
        guest_name=current_user.nombre
    ))
    
    return {"id": reservation.id, "status": "confirmada"}
```

---

## 🔍 Troubleshooting

### Error: "Token inválido"
```python
# Verificar que el token no esté expirado
payload = decode_token(token)
if payload is None:
    # Token expirado o inválido, usar refresh token
    new_tokens = generate_token_pair(user_id)
```

### Error: "Can't send email"
```
- Verificar que mailpit está corriendo: docker compose ps
- Revisar credenciales SMTP en .env
- Ver logs: docker compose logs mailpit
```

### Error: "SECRET_KEY not configured"
```
# En .env, generar con:
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

**Ver también:** [INDEX.md](INDEX.md) | [QUICKSTART.md](QUICKSTART.md) | [BEST_PRACTICES.md](BEST_PRACTICES.md)
