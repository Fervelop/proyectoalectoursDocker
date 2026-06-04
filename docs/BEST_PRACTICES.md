# Mejores Prácticas - AlecTours Backend

Guía de DO's y DON'Ts para escribir código de calidad.

---

## 🔐 Seguridad

### ✅ DO: Hashear TODAS las contraseñas

```python
from app.core.security import hash_password

hashed = hash_password(password)  # ✓
user = User(password=hashed)
db.add(user)
db.commit()
```

### ❌ DON'T: Contraseñas en texto plano

```python
user = User(password=password)  # ✗ Nunca
```

---

### ✅ DO: Usar token pairs (access + refresh)

```python
tokens = generate_token_pair(user_id)
# {"access_token": "...", "refresh_token": "...", "token_type": "bearer"}
```

### ❌ DON'T: Solo access token

```python
token = create_access_token(data={"sub": str(user_id)})  # ✗ Falta refresh
```

---

### ✅ DO: Validar tokens de forma segura

```python
from app.core.security import get_user_from_token

async def get_current_user(credentials: HTTPAuthCredentials = Depends(security)):
    user_id = get_user_from_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(status_code=401)
    return user_id
```

### ❌ DON'T: Confiar en tokens sin validar

```python
user_id = int(token.split(".")[1])  # ✗ Inseguro
```

---

## 📧 Email

### ✅ DO: Enviar emails DESPUÉS de guardar en BD

```python
# Crear usuario
user = User(...)
db.add(user)
db.commit()

# Luego enviar email
await send_welcome_email(user.email, user.nombre)  # ✓
```

### ❌ DON'T: Antes de guardar

```python
# Email primero
await send_welcome_email(email, nombre)

# Luego usuario (si falla BD, email ya se envió)
user = User(...)
db.add(user)
db.commit()
```

---

### ✅ DO: Ejecutar emails en background

```python
import asyncio

@router.post("/reservas")
async def create_reservation(...):
    reservation = Reservation(...)
    db.add(reservation)
    db.commit()
    
    # No esperar el email
    asyncio.create_task(send_reservation_confirmation(...))
    
    return {"id": reservation.id}  # ✓ Respuesta rápida
```

### ❌ DON'T: Bloquear esperando email

```python
await send_reservation_confirmation(...)  # ✗ Espera a que se envíe
return {"id": reservation.id}  # Respuesta lenta
```

---

### ✅ DO: Manejar errores de email gracefully

```python
try:
    await send_welcome_email(email, nombre)
except Exception as e:
    logger.error(f"Email error: {e}")
    # Continuar sin fallar

return user  # ✓ Usuario se crea aunque falle el email
```

### ❌ DON'T: Fallar si el email falla

```python
await send_welcome_email(email, nombre)  # Si falla...
return user  # Error 500, todo se revierte
```

---

## 🗄️ Base de Datos

### ✅ DO: Usar transacciones para operaciones múltiples

```python
try:
    reservation = Reservation(...)
    db.add(reservation)
    
    for servicio in servicios:
        rs = ReservationService(...)
        db.add(rs)
    
    db.commit()  # ✓ Todo o nada
except Exception:
    db.rollback()
    raise
```

### ❌ DON'T: Múltiples commits sin transacción

```python
db.add(reservation)
db.commit()  # ✗ Commit 1

for servicio in servicios:
    db.add(ReservationService(...))
    db.commit()  # ✗ Commit 2 - Si falla aquí, reserva se quedó guardada
```

---

### ✅ DO: Usar `.first()` en lugar de indexar

```python
user = db.query(User).filter(User.id == user_id).first()  # ✓

if not user:
    raise HTTPException(status_code=404)
```

### ❌ DON'T: Asumir que existe

```python
user = db.query(User).filter(User.id == user_id).all()[0]  # ✗ IndexError
```

---

## 🧪 Testing

### ✅ DO: Mock emails en tests

```python
from unittest.mock import patch, AsyncMock

with patch('app.core.mail.send_welcome_email', new_callable=AsyncMock):
    response = await client.post("/register", json={...})
    assert response.status_code == 200
```

### ❌ DON'T: Enviar emails reales en tests

```python
# ✗ Esto envía un email REAL
response = await client.post("/register", json={...})
assert response.status_code == 200
```

---

## 📝 Logging

### ✅ DO: Loguear operaciones sensibles

```python
logger.info(f"Login attempt: {email}")
if not verify_password(password, user.password):
    logger.warning(f"Invalid password for: {email}")
    raise HTTPException(status_code=401)
logger.info(f"Login successful: {email}")
```

### ❌ DON'T: Loguear secretos

```python
logger.info(f"Password: {password}")  # ✗ Nunca
logger.info(f"Token: {token}")        # ✗ Nunca
```

---

## 🚀 Production

### ✅ DO: Variables de entorno diferentes

```
.env (dev)
SECRET_KEY=dev-key
MAIL_SERVER=mailpit

.env.production (prod - NO en Git)
SECRET_KEY=<generar_seguro>
MAIL_SERVER=smtp.gmail.com
```

### ❌ DON'T: Hardcodear secretos

```python
SECRET_KEY = "mi-clave"  # ✗ Nunca
MAIL_PASSWORD = "pass"   # ✗ Nunca
```

---

## ✅ Checklist

- [ ] Contraseñas hasheadas
- [ ] Tokens JWT con expiración
- [ ] Refresh tokens implementados
- [ ] Validación de tokens en rutas protegidas
- [ ] Emails con try/catch
- [ ] CORS configurado
- [ ] SECRET_KEY diferente en producción
- [ ] .env en .gitignore
- [ ] Logging de acciones importantes
- [ ] Tests sin emails reales

---

**Ver también:** [INDEX.md](INDEX.md) | [QUICKSTART.md](QUICKSTART.md) | [CORE_README.md](CORE_README.md)
