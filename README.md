# Proyecto AlekTours - Backend & Frontend

Sistema de gestión de reservas de viajes y hoteles desarrollado con **FastAPI** (Backend) y una interfaz moderna (Frontend).

---

## 📋 Estructura del Proyecto

```mermaid
graph TD
    A[proyecto-be-fe-alektours] --> B[backend]
    A --> C[frontend]
    A --> D[docker-compose.yml]
    A --> E[.gitignore]
    A --> F[README.md]
    
    B --> B1[app/core]
    B --> B2[app/models]
    B --> B3[app/routes]
    B --> B4[app/services]
    B --> B5[app/repositories]
    B --> B6[app/schemas]
    B --> B7[alembic/]
    B --> B8[Dockerfile]
    B --> B9[requirements.txt]
    B --> B10[.env]
    B --> B11[QUICKSTART.md]
    B --> B12[verify_setup.py]
    
    B1 --> B1A["config.py - Variables de entorno"]
    B1 --> B1B["database.py - SQLAlchemy"]
    B1 --> B1C["security.py - JWT + Hashing"]
    B1 --> B1D["mail.py - Envío de emails"]
    B1 --> B1E["examples.py - Ejemplos de uso"]
    B1 --> B1F["README.md - Documentación core"]
    
    C --> C1[Frontend App]
    
    style B1 fill:#e1f5ff
    style B1A fill:#b3e5fc
    style B1B fill:#b3e5fc
    style B1C fill:#b3e5fc
    style B1D fill:#b3e5fc
```

---

## ⚙️ Variables de Entorno (.env)

El archivo `.env` contiene la configuración sensible de la aplicación. **No debe ser versionado en Git** (incluido en `.gitignore`).

### Localización
- `backend/.env` — Configuración del servidor FastAPI
- `.env` (opcional) — Variables globales del proyecto

### Variables Configurables

```env
# Base de Datos PostgreSQL
DATABASE_URL=postgresql+psycopg://admin:admin123@postgres:5432/alektours_db

# Autenticación JWT
SECRET_KEY=tu_clave_secreta_aqui_cambiar_en_produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Email (SMTP)
MAIL_USERNAME=tu_correo@example.com
MAIL_PASSWORD=tu_contraseña_app
MAIL_FROM=noreply@alektours.com
MAIL_PORT=1025
MAIL_SERVER=mailpit
MAIL_FROM_NAME=AlekTours
MAIL_STARTTLS=False
MAIL_SSL_TLS=False
```

### Explicación de cada variable

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | Cadena de conexión PostgreSQL | `postgresql+psycopg://admin:admin123@postgres:5432/alektours_db` |
| `SECRET_KEY` | Clave para firmar JWT tokens | (vacío - requiere configuración) |
| `ALGORITHM` | Algoritmo de encriptación JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiración de tokens en minutos | `30` |
| `MAIL_USERNAME` | Usuario SMTP para envío de correos | (vacío) |
| `MAIL_PASSWORD` | Contraseña SMTP | (vacío) |
| `MAIL_FROM` | Dirección de correo origen | `test@test.com` |
| `MAIL_PORT` | Puerto SMTP | `1025` |
| `MAIL_SERVER` | Servidor SMTP (mailpit en Docker) | `mailpit` |
| `MAIL_FROM_NAME` | Nombre visible del remitente | `FastAPI App` |
| `MAIL_STARTTLS` | Usar STARTTLS | `False` |
| `MAIL_SSL_TLS` | Usar SSL/TLS | `False` |

---

## 🗄️ Base de Datos

### Esquema: `alektours_db`

La aplicación usa **PostgreSQL 16** con las siguientes tablas principales:

- **hoteles** — Información de hoteles
- **habitaciones** — Habitaciones disponibles
- **clientes** — Datos de clientes
- **empleados** — Staff y roles
- **reservas** — Gestión de reservas
- **servicios** — Servicios turísticos
- **paquetes** — Paquetes de viaje
- **pagos** — Procesamiento de pagos

---

## 🚀 Cómo Ejecutar

### 0. Verificar el Setup (Opcional pero recomendado)

```bash
cd backend
python verify_setup.py
```

Esto verifica que todas las dependencias, variables y archivos necesarios estén configurados.

### 1. Levantar los Contenedores

```bash
docker compose up -d
```

Este comando inicia:
- **postgres** (PostgreSQL 16) — Base de datos
- **backend** (FastAPI) — API en http://localhost:8000
- **mailpit** — SMTP de prueba en http://localhost:8025
- **pgadmin** — Admin de BD en http://localhost:5050

### 2. Crear la Base de Datos (si no existe)

```bash
docker compose exec postgres psql -U admin -c "CREATE DATABASE alektours_db;"
```

### 3. Ejecutar Migraciones (Alembic)

```bash
docker compose exec backend alembic upgrade head
```

O localmente:

```bash
cd backend
alembic upgrade head
```

---

## � Módulos Core

La aplicación tiene módulos centralizados en `backend/app/core/`:

### Security (`security.py`)
- **hash_password()** — Hashear contraseñas con bcrypt
- **verify_password()** — Verificar contraseñas
- **create_access_token()** — Generar tokens JWT (30 min)
- **create_refresh_token()** — Generar refresh tokens (7 días)
- **get_user_from_token()** — Extraer user_id de un token

**Ejemplo:**
```python
from app.core.security import hash_password, verify_password, generate_token_pair

pwd_hash = hash_password("password123")
is_valid = verify_password("password123", pwd_hash)
tokens = generate_token_pair(user_id=1)
```

### Mail (`mail.py`)
- **send_email()** — Email genérico
- **send_welcome_email()** — Bienvenida
- **send_verification_email()** — Verificación de cuenta
- **send_password_reset_email()** — Reset de contraseña
- **send_reservation_confirmation()** — Confirmación de reserva
- **send_cancellation_email()** — Cancelación de reserva

**Ejemplo:**
```python
from app.core.mail import send_welcome_email, send_reservation_confirmation

await send_welcome_email("user@example.com", "Juan")
await send_reservation_confirmation(
    email="user@example.com",
    reservation_id=123,
    hotel_name="Hotel Paradise",
    check_in="2026-06-10",
    check_out="2026-06-15",
    total_price=500.00,
    guest_name="Juan Pérez"
)
```

📖 **Documentación completa:** Ver [backend/app/core/README.md](backend/app/core/README.md)

📝 **Ejemplos de uso:** Ver [backend/app/core/examples.py](backend/app/core/examples.py)

---

```
proyecto-be-fe-alektours/
├── backend/
│   ├── app/
│   │   ├── core/              # Configuración centralizada
│   │   │   ├── config.py      # Settings (DATABASE_URL, etc.)
│   │   │   ├── database.py    # SQLAlchemy engine & sesiones
│   │   │   ├── mail.py        # Configuración de email
│   │   │   └── security.py    # JWT, hashing
│   │   ├── models/            # Modelos SQLAlchemy
│   │   ├── routes/            # Endpoints FastAPI
│   │   ├── services/          # Lógica de negocio
│   │   ├── repositories/      # Acceso a datos
│   │   ├── schemas/           # Modelos Pydantic
│   │   └── main.py            # Aplicación FastAPI
│   ├── alembic/               # Migraciones de BD
│   ├── Dockerfile             # Imagen Docker
│   ├── requirements.txt        # Dependencias Python
│   └── .env                   # Variables de entorno
├── frontend/                  # Aplicación Frontend
├── docker-compose.yml         # Orquestación de servicios
├── .gitignore                 # Archivos ignorados
└── README.md                  # Este archivo
```

---

## 🔒 Credenciales por Defecto (Desarrollo)

| Servicio | Usuario | Contraseña | URL |
|----------|---------|-----------|-----|
| PostgreSQL | `admin` | `admin123` | `localhost:5432` |
| PgAdmin | `correoadmin@gmail.com` | `admin1234` | `http://localhost:5050` |
| FastAPI Docs | — | — | `http://localhost:8000/docs` |
| Mailpit | — | — | `http://localhost:8025` |

⚠️ **Nota**: Cambiar estas credenciales en producción.

---

## 📚 Documentación Adicional

- **Swagger (OpenAPI)**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **PgAdmin**: http://localhost:5050
- **Mailpit**: http://localhost:8025

---

## 🛠️ Dependencias Principales

```
fastapi==0.115.0          # Framework Web
sqlalchemy==2.0.35        # ORM
psycopg2-binary==2.9.9    # Driver PostgreSQL
alembic==1.13.2           # Migraciones BD
pydantic==2.9.2           # Validación de datos
python-jose==3.3.0        # Tokens JWT
fastapi-mail==1.4.1       # Envío de emails
```

Ver `backend/requirements.txt` para lista completa.

---

## 🐛 Solución de Problemas

### El contenedor `backend` no levanta

```bash
docker compose logs backend
```

### PostgreSQL no responde

```bash
docker compose restart postgres
docker compose exec postgres psql -U admin -c "SELECT 1;"
```

### Limpiar todo y empezar desde cero

```bash
docker compose down -v
docker compose up -d
docker compose exec postgres psql -U admin -c "CREATE DATABASE alektours_db;"
docker compose exec backend alembic upgrade head
```

---

**Último actualizado**: Junio 2026
# proyectoalektoursDocker
