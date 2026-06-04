# Backend - AlecTours API

API REST completa para gestión de hoteles, empleados, clientes y reservas.

---

## 🎯 Características Implementadas

✅ **Módulo Cliente**
- CRUD completo de clientes
- Email de bienvenida automático
- Búsqueda y filtrado

✅ **Módulo Empleado**
- CRUD de empleados
- Soft delete (marcar como inactivo)
- Estadísticas (total, activos, inactivos)

✅ **Módulo Hotel**
- CRUD de hoteles
- Filtrado por ciudad y calificación
- Relación con habitaciones y características

✅ **Módulo Reserva**
- CRUD de reservas
- Cambio de estado (pendiente → confirmada → cancelada/finalizada)
- Historial de cambios con auditoría
- Emails automáticos (confirmación, cancelación)
- Cálculo de ingresos

✅ **Arquitectura de 4 Capas**
- Routes (FastAPI)
- Services (Lógica de negocio)
- Repositories (Acceso a datos)
- Models (SQLAlchemy ORM)

✅ **Base de Datos**
- PostgreSQL con 25+ tablas
- Relaciones complejas (1:1, 1:N, N:N)
- Constraints y validaciones
- Soft delete en empleados

---

## 📂 Estructura

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py         ← Variables de entorno
│   │   ├── database.py       ← Conexión a BD
│   │   ├── security.py       ← JWT + Hashing
│   │   ├── mail.py           ← Envío de emails
│   │   └── examples.py       ← Ejemplos de uso
│   │
│   ├── models/__init__.py    ← 15 modelos SQLAlchemy
│   ├── schemas/__init__.py   ← Schemas Pydantic
│   ├── repositories/__init__.py ← 4 Repositories
│   ├── services/__init__.py  ← 4 Services
│   ├── routes/__init__.py    ← 4 Routers (25+ endpoints)
│   │
│   └── main.py               ← FastAPI app
│
├── alembic/                  ← Migraciones
├── Dockerfile                ← Para Docker
├── requirements.txt          ← Dependencias Python
├── verify_setup.py           ← Verificación de setup
├── MODULES.md               ← Documentación de módulos
└── BEST_PRACTICES.md        ← Mejores prácticas
```

---

## 🚀 Inicio Rápido

### 1. Levantar Contenedores

```bash
cd ..
docker compose up -d
```

### 2. Ejecutar Migraciones

```bash
cd backend

# Crear BD
docker compose exec postgres psql -U admin -c "CREATE DATABASE alektours_db;"

# Ejecutar schema SQL (opcional, para estructura rápida)
docker compose exec postgres psql -U admin alektours_db < app/schema.sql

# O con Alembic (recomendado)
alembic upgrade head
```

### 3. Iniciar Servidor

```bash
uvicorn app.main:app --reload
```

### 4. Probar API

**Swagger docs:** http://localhost:8000/docs

**ReDoc:** http://localhost:8000/redoc

---

## 📖 Documentación

- **MODULES.md** — Documentación completa de los 4 módulos
- **BEST_PRACTICES.md** — DO's y DON'Ts
- **docs/INDEX.md** — Índice maestro de toda la documentación
- **docs/QUICKSTART.md** — Guía de 5 minutos
- **docs/ARCHITECTURE.md** — Patrones y diagrama de arquitectura

---

## 🔗 API Endpoints

### Clientes (25 líneas)

```
POST   /clientes/              → Crear cliente
GET    /clientes/              → Listar clientes
GET    /clientes/{id}          → Obtener cliente
GET    /clientes/buscar/{term} → Buscar
PUT    /clientes/{id}          → Actualizar
DELETE /clientes/{id}          → Eliminar
```

### Empleados (28 líneas)

```
POST   /empleados/             → Crear empleado
GET    /empleados/             → Listar empleados
GET    /empleados/{id}         → Obtener empleado
GET    /empleados/buscar/{term}→ Buscar
PUT    /empleados/{id}         → Actualizar
PATCH  /empleados/{id}/desactivar → Desactivar
GET    /empleados/stats/total  → Estadísticas
```

### Hoteles (28 líneas)

```
POST   /hoteles/               → Crear hotel
GET    /hoteles/               → Listar hoteles
GET    /hoteles/{id}           → Obtener hotel
GET    /hoteles/buscar/{term}  → Buscar
GET    /hoteles/calificacion/  → Por calificación
PUT    /hoteles/{id}           → Actualizar
DELETE /hoteles/{id}           → Eliminar
GET    /hoteles/stats/total    → Estadísticas
```

### Reservas (30 líneas)

```
POST   /reservas/              → Crear reserva
GET    /reservas/              → Listar reservas
GET    /reservas/{id}          → Obtener reserva
GET    /reservas/cliente/{id}  → Por cliente
PUT    /reservas/{id}          → Actualizar
PATCH  /reservas/{id}/confirmar → Confirmar
PATCH  /reservas/{id}/cancelar → Cancelar
GET    /reservas/{id}/ingresos → Ingresos
GET    /reservas/stats/total   → Estadísticas
```

---

## 💾 Base de Datos

### Tablas Principales

| Tabla | Descripción | Relaciones |
|-------|-------------|-----------|
| `clientes` | Información de clientes | → usuarios, reservas |
| `empleados` | Información de empleados | → usuarios, reservas, roles |
| `usuarios` | Autenticación (JWT) | → cliente O empleado |
| `hoteles` | Información de hoteles | → habitaciones, características, paquetes |
| `habitaciones` | Habitaciones de hoteles | → reserva_habitaciones |
| `reservas` | Reservas de clientes | → pagos, historial, cliente, empleado |
| `reserva_habitaciones` | Habitaciones en reserva (N:N) | |
| `reserva_servicios` | Servicios en reserva (N:N) | |
| `pagos` | Pagos de reservas | |
| `historial_reservas` | Auditoría de cambios | |

---

## 🔐 Seguridad

✅ **Contraseñas:** Hasheadas con bcrypt
✅ **Tokens:** JWT con expiración
✅ **Validación:** Pydantic en todas las requests
✅ **Autorización:** Ready para roles
✅ **Logging:** Todas las acciones registradas

---

## 📧 Emails Automáticos

- ✅ **Bienvenida** — Al registrarse cliente
- ✅ **Confirmación de Reserva** — Al crear reserva
- ✅ **Cancelación** — Al cancelar reserva

---

## 🧪 Testing

### Con curl

```bash
# Crear cliente
curl -X POST "http://localhost:8000/clientes/" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "cedula": "123456789",
    "correo": "juan@example.com"
  }'

# Listar clientes
curl "http://localhost:8000/clientes/"

# Listar reservas
curl "http://localhost:8000/reservas/"
```

### Swagger UI

Ir a http://localhost:8000/docs y probar endpoints interactivamente

---

## 🛠️ Desarrollo

### Agregar Nuevo Endpoint

1. **Crear método en Service** (`app/services/__init__.py`)
2. **Crear método en Repository** (`app/repositories/__init__.py`)
3. **Crear schema Pydantic** (`app/schemas/__init__.py`)
4. **Agregar ruta en Router** (`app/routes/__init__.py`)

### Crear Nueva Tabla

1. **Crear modelo** en `app/models/__init__.py`
2. **Crear migración** con Alembic
3. **Ejecutar migración** con `alembic upgrade head`

---

## 📦 Dependencias

Principales:
- **FastAPI** — Framework web
- **SQLAlchemy** — ORM para BD
- **Pydantic** — Validación de datos
- **python-jose** — JWT
- **passlib** — Hashing de contraseñas
- **python-multipart** — Formularios
- **aiosmtplib** — Emails async

Ver `requirements.txt` para lista completa.

---

## ✅ Checklist

- [x] Módulo Cliente completo
- [x] Módulo Empleado completo
- [x] Módulo Hotel completo
- [x] Módulo Reserva completo
- [x] Emails automáticos
- [x] Arquitectura de 4 capas
- [x] 25+ endpoints
- [x] Documentación completa
- [ ] Autenticación JWT en routes
- [ ] Tests unitarios
- [ ] Tests de integración
- [ ] Deployment a producción

---

## 🚀 Próximos Pasos

1. **Implementar autenticación** en routes protegidas
2. **Crear módulo de Servicios** (tours, excursiones)
3. **Crear módulo de Pagos** (integrar con gateway)
4. **Agregar más validaciones** de negocio
5. **Crear tests** unitarios e integración
6. **Optimizar queries** con índices
7. **Agregar caché** con Redis
8. **Desplegar** a producción

---

## 📝 Notas

- Todos los emails usan Mailpit en desarrollo (puerto 1025)
- En producción, cambiar a Gmail, SendGrid, etc.
- Los empleados usan soft delete (no se eliminan realmente)
- El historial de reservas proporciona auditoría completa
- Las validaciones están en Pydantic (automáticas)

---

**¡Listo para usar! 🚀**

Para más info, ver [docs/INDEX.md](../docs/INDEX.md)
