# 📦 Módulos Creados - Cliente, Empleado, Hotel, Reserva

Documentación completa de los módulos implementados con arquitectura de 4 capas.

---

## 🏗️ Arquitectura de 4 Capas

Cada módulo (Cliente, Empleado, Hotel, Reserva) sigue una arquitectura de 4 capas:

```
Routes (FastAPI)
    ↓ (Recibe request, llama service)
Services (Lógica de negocio)
    ↓ (Usa repository, valida datos)
Repositories (Acceso a datos)
    ↓ (Queries SQL)
Models (SQLAlchemy ORM)
    ↓
PostgreSQL
```

---

## 👥 CLIENTE - Cliente y Usuario

### Modelos

```python
from app.models import Cliente, Usuario

# Cliente: información personal
class Cliente(Base):
    id_cliente: int
    nombre: str
    apellido: str
    cedula: str (único)
    correo: str (único)
    celular: str
    ...
    reservas: List[Reserva]
    usuario: Usuario (relación 1:1)

# Usuario: autenticación
class Usuario(Base):
    id_usuario: int
    username: str (único)
    correo_electronico: str (único)
    password_hash: str
    id_cliente: int (único, referencia a Cliente)
    activo: bool
```

### Endpoints

```
POST   /clientes/              → Crear cliente (envía email de bienvenida)
GET    /clientes/              → Listar clientes (paginado)
GET    /clientes/{id}          → Obtener cliente por ID
GET    /clientes/buscar/{term} → Buscar clientes
PUT    /clientes/{id}          → Actualizar cliente
DELETE /clientes/{id}          → Eliminar cliente
```

### Uso

```python
from app.schemas import ClienteCreate
from app.services import ClienteService

# Crear cliente
cliente_data = ClienteCreate(
    nombre="Juan",
    apellido="Pérez",
    cedula="123456789",
    correo="juan@example.com",
    celular="3001234567"
)

service = ClienteService(db)
cliente = await service.registrar_cliente(cliente_data.dict())
# Automáticamente envía email de bienvenida
```

---

## 👨‍💼 EMPLEADO - Empleado y Roles

### Modelos

```python
from app.models import Empleado, Rol

# Empleado
class Empleado(Base):
    id_empleado: int
    nombre: str
    apellido: str
    cedula: str (único)
    correo_electronico: str (único)
    fecha_contratacion: date
    activo: bool (default True)
    ...
    roles: List[Rol] (relación many-to-many)
    reservas: List[Reserva]

# Rol
class Rol(Base):
    id_rol: int
    nombre_rol: str (único)
    ...
    empleados: List[Empleado]
```

### Endpoints

```
POST   /empleados/                    → Crear empleado
GET    /empleados/                    → Listar empleados (con filtro activo)
GET    /empleados/{id}                → Obtener empleado por ID
GET    /empleados/buscar/{term}       → Buscar empleados
PUT    /empleados/{id}                → Actualizar empleado
PATCH  /empleados/{id}/desactivar     → Desactivar empleado (soft delete)
GET    /empleados/stats/total         → Estadísticas (total, activos, inactivos)
```

### Uso

```python
from app.schemas import EmpleadoCreate
from app.services import EmpleadoService

# Crear empleado
empleado_data = EmpleadoCreate(
    nombre="María",
    apellido="García",
    cedula="987654321",
    correo_electronico="maria@alectours.com",
    fecha_contratacion=date(2026, 1, 15)
)

service = EmpleadoService(db)
empleado = service.crear_empleado(empleado_data.dict())
```

---

## 🏨 HOTEL - Hotel y Habitaciones

### Modelos

```python
from app.models import Hotel, Habitacion, TipoHabitacion, Caracteristica

# Hotel
class Hotel(Base):
    id_hotel: int
    nombre_hotel: str
    calificacion: int (1-5)
    direccion: str
    ciudad: str
    pais: str
    ...
    habitaciones: List[Habitacion]
    caracteristicas: List[Caracteristica] (many-to-many)

# Habitacion
class Habitacion(Base):
    id_habitacion: int
    id_hotel: int (FK)
    numero_habitacion: str
    precio_noche: float
    estado: str (disponible/ocupada/mantenimiento)
    ...
    reservas: List[ReservaHabitacion]

# TipoHabitacion
class TipoHabitacion(Base):
    id_tipo_habitacion: int
    nombre_tipo: str (sencilla, doble, suite, etc.)
    capacidad_personas: int
    descripcion: str

# Caracteristica
class Caracteristica(Base):
    id_caracteristica: int
    nombre_caracteristica: str (WiFi, Piscina, Gym, etc.)
    ...
    hoteles: List[Hotel] (many-to-many)
```

### Endpoints

```
POST   /hoteles/                     → Crear hotel
GET    /hoteles/                     → Listar hoteles (con filtro ciudad)
GET    /hoteles/{id}                 → Obtener hotel por ID
GET    /hoteles/buscar/{term}        → Buscar hoteles
GET    /hoteles/calificacion/{min}   → Filtrar por calificación
PUT    /hoteles/{id}                 → Actualizar hotel
DELETE /hoteles/{id}                 → Eliminar hotel
GET    /hoteles/stats/total          → Estadísticas
```

### Uso

```python
from app.schemas import HotelCreate
from app.services import HotelService

# Crear hotel
hotel_data = HotelCreate(
    nombre_hotel="Hotel Paradise",
    calificacion=5,
    ciudad="Cartagena",
    pais="Colombia",
    direccion="Calle 1 #123"
)

service = HotelService(db)
hotel = service.crear_hotel(hotel_data.dict())
```

---

## 📅 RESERVA - Reserva, Pagos e Historial

### Modelos

```python
from app.models import Reserva, ReservaHabitacion, ReservaServicio, Pago, HistorialReserva

# Reserva
class Reserva(Base):
    id_reserva: int
    id_cliente: int (FK)
    id_empleado: int (FK, nullable)
    id_paquete: int (FK, nullable)
    fecha_inicio: date
    fecha_fin: date
    numero_personas: int
    estado: str (pendiente/confirmada/cancelada/finalizada)
    fecha_reserva: datetime
    ...
    cliente: Cliente
    empleado: Empleado
    habitaciones: List[ReservaHabitacion]
    servicios: List[ReservaServicio]
    pagos: List[Pago]
    historial: List[HistorialReserva]

# ReservaHabitacion (muchos a muchos con Habitacion)
class ReservaHabitacion(Base):
    id_reserva: int (PK, FK)
    id_habitacion: int (PK, FK)
    fecha_checkin: date
    fecha_checkout: date
    precio_acordado: float

# ReservaServicio (muchos a muchos con Servicio)
class ReservaServicio(Base):
    id_reserva: int (PK, FK)
    id_servicio: int (PK, FK)
    fecha_servicio: date
    numero_personas: int
    precio_acordado: float

# Pago
class Pago(Base):
    id_pago: int
    id_reserva: int (FK)
    id_metodo_pago: int (FK)
    monto: float
    fecha_pago: datetime
    estado: str (pendiente/pagado/rechazado)

# HistorialReserva (auditoría)
class HistorialReserva(Base):
    id_historial: int
    id_reserva: int (FK)
    estado_anterior: str
    estado_nuevo: str
    fecha_cambio: datetime
    id_empleado_responsable: int (FK, nullable)
    comentarios: str
```

### Endpoints

```
POST   /reservas/                           → Crear reserva
GET    /reservas/                           → Listar reservas (con filtro estado)
GET    /reservas/{id}                       → Obtener reserva detallada
GET    /reservas/cliente/{cliente_id}       → Obtener reservas de cliente
PUT    /reservas/{id}                       → Actualizar reserva
PATCH  /reservas/{id}/confirmar             → Confirmar reserva
PATCH  /reservas/{id}/cancelar              → Cancelar reserva (envía email)
GET    /reservas/{id}/ingresos              → Obtener ingresos totales
GET    /reservas/stats/total                → Estadísticas
```

### Uso

```python
from app.schemas import ReservaCreate, ReservaHabitacionCreate, ReservaServicioCreate
from app.services import ReservaService

# Crear reserva con habitaciones y servicios
habitaciones = [
    ReservaHabitacionCreate(
        id_habitacion=1,
        fecha_checkin=date(2026, 6, 10),
        fecha_checkout=date(2026, 6, 15),
        precio_acordado=100.0
    )
]

servicios = [
    ReservaServicioCreate(
        id_servicio=1,
        fecha_servicio=date(2026, 6, 12),
        numero_personas=2,
        precio_acordado=50.0
    )
]

reserva_data = ReservaCreate(
    id_cliente=1,
    fecha_inicio=date(2026, 6, 10),
    fecha_fin=date(2026, 6, 15),
    numero_personas=2,
    habitaciones=habitaciones,
    servicios=servicios
)

service = ReservaService(db)
reserva = await service.crear_reserva(
    reserva_data.dict(exclude={"habitaciones", "servicios"}),
    habitaciones=habitaciones,
    servicios=servicios
)
# Automáticamente envía email de confirmación

# Confirmar reserva
reserva_confirmada = await service.confirmar_reserva(
    reserva_id=1,
    empleado_id=1
)

# Cancelar reserva
reserva_cancelada = await service.cancelar_reserva(
    reserva_id=1,
    empleado_id=1,
    razon="Cliente solicitó cancelación"
)
# Automáticamente envía email de cancelación
```

---

## 🔄 Flujos de Negocio

### Flujo 1: Crear Cliente y Reservar

```
1. Cliente se registra (POST /clientes/)
   → Email de bienvenida automático
   
2. Empleado crea reserva (POST /reservas/)
   → Email de confirmación automático
   
3. Empleado confirma reserva (PATCH /reservas/{id}/confirmar)
   → Historial registrado
   
4. Cliente cancela (PATCH /reservas/{id}/cancelar)
   → Email de cancelación automático
   → Historial registrado
```

### Flujo 2: Gestionar Hotel

```
1. Admin crea hotel (POST /hoteles/)

2. Admin agrega habitaciones (relación en modelo)

3. Admin agrega características (many-to-many)

4. Clientes ven disponibilidad (GET /hoteles/{id}/habitaciones-disponibles)

5. Empleado reserva habitación para cliente
```

---

## 📊 Endpoints de Estadísticas

```python
# Empleados
GET /empleados/stats/total
→ {
    "total": 25,
    "activos": 23,
    "inactivos": 2
}

# Hoteles
GET /hoteles/stats/total
→ {"total": 10}

# Reservas
GET /reservas/stats/total
→ {
    "total": 150,
    "pendientes": 20,
    "confirmadas": 100,
    "canceladas": 20,
    "finalizadas": 10
}

# Reserva específica
GET /reservas/{id}/ingresos
→ {
    "id_reserva": 1,
    "ingresos_totales": 500.00
}
```

---

## 🔐 Validaciones Automáticas

### Cliente
- ✅ Cédula única
- ✅ Correo único (si se proporciona)
- ✅ Nombre y apellido no vacíos
- ✅ Email válido

### Empleado
- ✅ Cédula única
- ✅ Correo único (si se proporciona)
- ✅ No se pueden eliminar (soft delete)

### Hotel
- ✅ Calificación entre 1-5

### Reserva
- ✅ Fecha inicio < Fecha fin
- ✅ Número de personas > 0
- ✅ No se puede modificar cancelada o finalizada
- ✅ Cambios de estado registrados en historial

---

## 🚀 Próximos Pasos

1. **Crear migraciones Alembic**
   ```bash
   alembic revision --autogenerate -m "Create all tables"
   alembic upgrade head
   ```

2. **Insertar datos de prueba**
   ```python
   # Crear empleados, hoteles, características, etc.
   ```

3. **Implementar autenticación**
   ```python
   # Usar /usuarios endpoint con JWT tokens
   ```

4. **Crear módulo de Pagos**
   ```python
   # Integrar con gateway de pagos
   ```

5. **Crear módulo de Servicios**
   ```python
   # Tours, excursiones, etc.
   ```

---

## 📚 Archivos Creados

```
backend/
├── app/
│   ├── models/__init__.py      ← 15 modelos (Cliente, Empleado, etc.)
│   ├── schemas/__init__.py     ← Schemas Pydantic
│   ├── repositories/__init__.py ← 4 Repositories
│   ├── services/__init__.py     ← 4 Services
│   ├── routes/__init__.py       ← 4 Routers (25+ endpoints)
│   └── main.py                 ← Actualizado con routers
```

---

## 🧪 Ejemplos de Uso Completos

### Ejemplo 1: Crear Cliente y Reserva

```bash
# 1. Crear cliente
curl -X POST "http://localhost:8000/clientes/" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "cedula": "123456789",
    "correo": "juan@example.com",
    "celular": "3001234567"
  }'

# 2. Crear reserva
curl -X POST "http://localhost:8000/reservas/" \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 1,
    "fecha_inicio": "2026-06-10",
    "fecha_fin": "2026-06-15",
    "numero_personas": 2,
    "habitaciones": [
      {
        "id_habitacion": 1,
        "fecha_checkin": "2026-06-10",
        "fecha_checkout": "2026-06-15",
        "precio_acordado": 500.0
      }
    ]
  }'

# 3. Confirmar reserva
curl -X PATCH "http://localhost:8000/reservas/1/confirmar?empleado_id=1" \
  -H "Content-Type: application/json"

# 4. Ver ingresos
curl "http://localhost:8000/reservas/1/ingresos"
```

---

**Ver también:** [ARCHITECTURE.md](../docs/ARCHITECTURE.md) | [QUICKSTART.md](../docs/QUICKSTART.md) | [INDEX.md](../docs/INDEX.md)
