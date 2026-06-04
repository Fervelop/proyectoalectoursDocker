# Variables de Entorno (.env)

Configuración completa de variables de entorno.

---

## 📝 Archivo .env

**Ubicación:** `backend/.env`

**No debe ser versionado en Git** (está en `.gitignore`)

Copiar desde `backend/.env.example` y llenar los valores.

---

## 🗄️ Base de Datos

### `DATABASE_URL`

**Descripción:** Cadena de conexión a PostgreSQL

**Formato:**
```
postgresql+psycopg://usuario:password@host:puerto/base_datos
```

**Ejemplo - Desarrollo (Docker):**
```env
DATABASE_URL=postgresql+psycopg://admin:admin123@postgres:5432/alektours_db
```

**Ejemplo - Producción:**
```env
DATABASE_URL=postgresql+psycopg://user:secure_password@db.example.com:5432/alektours_prod
```

**Componentes:**
- `admin` — Usuario de PostgreSQL
- `admin123` — Contraseña
- `postgres` — Host (nombre del servicio Docker o IP/dominio)
- `5432` — Puerto estándar
- `alektours_db` — Nombre de la base de datos

---

## 🔐 Autenticación JWT

### `SECRET_KEY`

**Descripción:** Clave secreta para firmar tokens JWT

**Generar clave segura:**
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

**Ejemplo:**
```env
SECRET_KEY=9K_kL-pM3nQrStUv-WxYz1Ab-CdEfGh-IjKl-MnOpQr
```

**⚠️ IMPORTANTE:**
- Debe ser diferente en cada ambiente
- Mínimo 32 caracteres
- Cambiar en producción
- Nunca compartir

### `ALGORITHM`

**Descripción:** Algoritmo de encriptación para JWT

**Valor:**
```env
ALGORITHM=HS256
```

**Opciones:**
- `HS256` — HMAC con SHA-256 (más común)
- `HS512` — HMAC con SHA-512 (más seguro)
- `RS256` — RSA con SHA-256 (requiere pares de claves)

### `ACCESS_TOKEN_EXPIRE_MINUTES`

**Descripción:** Duración de los tokens de acceso en minutos

**Valor recomendado:**
```env
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**Opciones:**
- `15` — Muy corto, requiere refresh frecuente
- `30` — Recomendado, balance seguridad/usabilidad
- `60` — Más conveniente pero menos seguro
- `1440` — Un día (solo si no hay riesgo de token comprometido)

---

## 📧 Configuración SMTP para Email

### Desarrollo (Mailpit)

```env
MAIL_USERNAME=dev@example.com
MAIL_PASSWORD=dev123
MAIL_FROM=noreply@alectours.com
MAIL_PORT=1025
MAIL_SERVER=mailpit
MAIL_FROM_NAME=AlecTours
MAIL_STARTTLS=False
MAIL_SSL_TLS=False
```

**Acceder a Mailpit:** http://localhost:8025

### Producción (Gmail)

```env
MAIL_USERNAME=tu_email@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_FROM=noreply@alectours.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com
MAIL_FROM_NAME=AlecTours
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

**Pasos para Gmail:**
1. Habilitar "Acceso de aplicaciones menos seguras" en Google Account
2. Generar "App Password" (contraseña de aplicación)
3. Usar ese password en `MAIL_PASSWORD`

### Producción (SendGrid)

```env
MAIL_USERNAME=apikey
MAIL_PASSWORD=SG.xxxxx
MAIL_FROM=noreply@alectours.com
MAIL_PORT=587
MAIL_SERVER=smtp.sendgrid.net
MAIL_FROM_NAME=AlecTours
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

### Producción (AWS SES)

```env
MAIL_USERNAME=AKIAXXXXX
MAIL_PASSWORD=xxx
MAIL_FROM=noreply@alectours.com
MAIL_PORT=587
MAIL_SERVER=email-smtp.us-east-1.amazonaws.com
MAIL_FROM_NAME=AlecTours
MAIL_STARTTLS=True
MAIL_SSL_TLS=False
```

---

## 📝 Explicación de cada Variable

| Variable | Descripción | Desarrollo | Producción |
|----------|-------------|-----------|-----------|
| `DATABASE_URL` | Conexión a PostgreSQL | `localhost` | Servidor remoto |
| `SECRET_KEY` | Clave JWT | `dev-key-no-secure` | `generar_seguro` |
| `ALGORITHM` | Algoritmo JWT | `HS256` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración token (min) | `30` | `30` |
| `MAIL_USERNAME` | Usuario SMTP | `dev@example.com` | Email real |
| `MAIL_PASSWORD` | Password SMTP | `dev123` | Contraseña app |
| `MAIL_FROM` | Email origen | `noreply@alectours.com` | `noreply@alectours.com` |
| `MAIL_PORT` | Puerto SMTP | `1025` (mailpit) | `587` o `465` |
| `MAIL_SERVER` | Servidor SMTP | `mailpit` | `smtp.gmail.com` |
| `MAIL_FROM_NAME` | Nombre remitente | `AlecTours` | `AlecTours` |
| `MAIL_STARTTLS` | Usar STARTTLS | `False` | `True` |
| `MAIL_SSL_TLS` | Usar SSL/TLS | `False` | `False` o `True` |

---

## 🔄 Cómo Usar en Código

```python
from app.core.config import settings

# Acceder a variables
print(settings.DATABASE_URL)
print(settings.SECRET_KEY)
print(settings.MAIL_FROM)
```

---

## ✅ Checklist

Antes de ejecutar el proyecto:

- [ ] Archivo `backend/.env` creado
- [ ] `DATABASE_URL` apunta a la BD correcta
- [ ] `SECRET_KEY` tiene al menos 32 caracteres
- [ ] Variables de email están completas
- [ ] No hay valores vacíos (excepto desarrollo)
- [ ] No hay datos sensibles en Git (`.env` en `.gitignore`)

---

## 🔒 Seguridad

### Generar SECRET_KEY seguro

```bash
# Linux/Mac
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Windows PowerShell
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Alternativa (sin Python)
openssl rand -base64 32
```

### Nunca commitear .env

```bash
# Verificar .gitignore
cat .gitignore | grep .env

# Resultado esperado:
# .env
# .env.local
# .env.*.local
```

### Variables en Servidor (Producción)

En lugar de .env, usar variables de entorno del servidor:

```bash
# Docker
docker run -e DATABASE_URL=... -e SECRET_KEY=... myapp

# GitHub Actions
secrets.DATABASE_URL
secrets.SECRET_KEY

# Heroku
heroku config:set DATABASE_URL=...

# AWS
Parameter Store / Secrets Manager
```

---

## 🚨 Errores Comunes

### Error: "DatabaseError: Can't connect"
```
✓ Verificar DATABASE_URL
✓ Verificar que PostgreSQL está corriendo
✓ Verificar credenciales (usuario/password)
```

### Error: "SECRET_KEY is empty"
```
✓ Generar con: python -c "import secrets; print(secrets.token_urlsafe(32))"
✓ Copiar a .env
```

### Error: "Failed to send email"
```
✓ Verificar MAIL_SERVER y MAIL_PORT
✓ Verificar MAIL_USERNAME y MAIL_PASSWORD
✓ Verificar que no hay firewall bloqueando el puerto
✓ Ver logs: docker compose logs mailpit
```

---

**Ver también:** [INDEX.md](INDEX.md) | [.env.example](.env.example) | [CORE_README.md](CORE_README.md)
