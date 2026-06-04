# API Routes - AlecTours

Resumen visual de todos los endpoints disponibles.

---

## 📋 Tabla Resumen

| Verbo | Ruta | Módulo | Descripción | Estado |
|-------|------|--------|-------------|--------|
| **CLIENTE** |
| POST | `/clientes/` | Cliente | Crear cliente (envía email) | ✅ |
| GET | `/clientes/` | Cliente | Listar clientes (paginado) | ✅ |
| GET | `/clientes/{id}` | Cliente | Obtener cliente por ID | ✅ |
| GET | `/clientes/buscar/{term}` | Cliente | Buscar cliente | ✅ |
| PUT | `/clientes/{id}` | Cliente | Actualizar cliente | ✅ |
| DELETE | `/clientes/{id}` | Cliente | Eliminar cliente | ✅ |
| **EMPLEADO** |
| POST | `/empleados/` | Empleado | Crear empleado | ✅ |
| GET | `/empleados/` | Empleado | Listar empleados (con filtro activo) | ✅ |
| GET | `/empleados/{id}` | Empleado | Obtener empleado | ✅ |
| GET | `/empleados/buscar/{term}` | Empleado | Buscar empleado | ✅ |
| PUT | `/empleados/{id}` | Empleado | Actualizar empleado | ✅ |
| PATCH | `/empleados/{id}/desactivar` | Empleado | Desactivar empleado | ✅ |
| GET | `/empleados/stats/total` | Empleado | Estadísticas | ✅ |
| **HOTEL** |
| POST | `/hoteles/` | Hotel | Crear hotel | ✅ |
| GET | `/hoteles/` | Hotel | Listar hoteles (con filtro ciudad) | ✅ |
| GET | `/hoteles/{id}` | Hotel | Obtener hotel | ✅ |
| GET | `/hoteles/buscar/{term}` | Hotel | Buscar hotel | ✅ |
| GET | `/hoteles/calificacion/{min}` | Hotel | Filtrar por calificación | ✅ |
| PUT | `/hoteles/{id}` | Hotel | Actualizar hotel | ✅ |
| DELETE | `/hoteles/{id}` | Hotel | Eliminar hotel | ✅ |
| GET | `/hoteles/stats/total` | Hotel | Estadísticas | ✅ |
| **RESERVA** |
| POST | `/reservas/` | Reserva | Crear reserva (envía email) | ✅ |
| GET | `/reservas/` | Reserva | Listar reservas (con filtro estado) | ✅ |
| GET | `/reservas/{id}` | Reserva | Obtener reserva detallada | ✅ |
| GET | `/reservas/cliente/{id}` | Reserva | Obtener reservas de cliente | ✅ |
| PUT | `/reservas/{id}` | Reserva | Actualizar reserva | ✅ |
| PATCH | `/reservas/{id}/confirmar` | Reserva | Confirmar reserva | ✅ |
| PATCH | `/reservas/{id}/cancelar` | Reserva | Cancelar reserva (envía email) | ✅ |
| GET | `/reservas/{id}/ingresos` | Reserva | Obtener ingresos totales | ✅ |
| GET | `/reservas/stats/total` | Reserva | Estadísticas | ✅ |
| **GENERAL** |
| GET | `/` | Root | Endpoint raíz | ✅ |
| GET | `/health` | Health | Health check | ✅ |

**Total: 31 endpoints**

---

## 🔹 CLIENTE (6 endpoints)

```
POST   /clientes/
GET    /clientes/
GET    /clientes/{id}
GET    /clientes/buscar/{search_term}
PUT    /clientes/{id}
DELETE /clientes/{id}
```

### Parámetros

```
POST /clientes/
Body: {
  "nombre": "Juan",
  "apellido": "Pérez",
  "cedula": "123456789",
  "correo": "juan@example.com",
  "celular": "3001234567",
  "direccion": "Calle 1 #123",
  "ciudad": "Cartagena",
  "pais": "Colombia",
  "fecha_nacimiento": "1990-05-15"
}

GET /clientes/?skip=0&limit=10
GET /clientes/1
GET /clientes/buscar/juan
PUT /clientes/1 - Body igual a POST (campos opcionales)
DELETE /clientes/1
```

---

## 🔹 EMPLEADO (7 endpoints)

```
POST   /empleados/
GET    /empleados/
GET    /empleados/{id}
GET    /empleados/buscar/{search_term}
PUT    /empleados/{id}
PATCH  /empleados/{id}/desactivar
GET    /empleados/stats/total
```

### Parámetros

```
POST /empleados/
Body: {
  "nombre": "María",
  "apellido": "García",
  "cedula": "987654321",
  "correo_electronico": "maria@alectours.com",
  "celular": "3007654321",
  "fecha_contratacion": "2026-01-15"
}

GET /empleados/?skip=0&limit=10&activo=true
GET /empleados/1
GET /empleados/buscar/maria
PUT /empleados/1 - Body igual a POST (campos opcionales)
PATCH /empleados/1/desactivar
GET /empleados/stats/total → { "total": 25, "activos": 23, "inactivos": 2 }
```

---

## 🔹 HOTEL (8 endpoints)

```
POST   /hoteles/
GET    /hoteles/
GET    /hoteles/{id}
GET    /hoteles/buscar/{search_term}
GET    /hoteles/calificacion/{min_rating}
PUT    /hoteles/{id}
DELETE /hoteles/{id}
GET    /hoteles/stats/total
```

### Parámetros

```
POST /hoteles/
Body: {
  "nombre_hotel": "Hotel Paradise",
  "calificacion": 5,
  "direccion": "Calle 1 #123",
  "ciudad": "Cartagena",
  "pais": "Colombia",
  "codigo_postal": "130001",
  "correo_electronico": "info@paradise.com",
  "telefono": "+57 123456789"
}

GET /hoteles/?skip=0&limit=10&ciudad=cartagena
GET /hoteles/1
GET /hoteles/buscar/paradise
GET /hoteles/calificacion/1?max_rating=5
PUT /hoteles/1 - Body igual a POST (campos opcionales)
DELETE /hoteles/1
GET /hoteles/stats/total → { "total": 10 }
```

---

## 🔹 RESERVA (9 endpoints)

```
POST   /reservas/
GET    /reservas/
GET    /reservas/{id}
GET    /reservas/cliente/{cliente_id}
PUT    /reservas/{id}
PATCH  /reservas/{id}/confirmar
PATCH  /reservas/{id}/cancelar
GET    /reservas/{id}/ingresos
GET    /reservas/stats/total
```

### Parámetros

```
POST /reservas/
Body: {
  "id_cliente": 1,
  "id_empleado": null,
  "id_paquete": null,
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
  ],
  "servicios": [
    {
      "id_servicio": 1,
      "fecha_servicio": "2026-06-12",
      "numero_personas": 2,
      "precio_acordado": 50.0
    }
  ]
}

GET /reservas/?skip=0&limit=10&estado=confirmada
GET /reservas/1
GET /reservas/cliente/1
PUT /reservas/1
  Body: { "estado": "confirmada", "fecha_inicio": "2026-06-10" }
PATCH /reservas/1/confirmar?empleado_id=1
PATCH /reservas/1/cancelar?empleado_id=1&razon=razón+de+cancelación
GET /reservas/1/ingresos
GET /reservas/stats/total → {
  "total": 150,
  "pendientes": 20,
  "confirmadas": 100,
  "canceladas": 20,
  "finalizadas": 10
}
```

---

## 🔹 GENERAL (2 endpoints)

```
GET /
GET /health
```

### Respuestas

```
GET /
→ {
  "message": "¡Bienvenido a AlecTours API! 🚀",
  "docs": "/docs",
  "redoc": "/redoc"
}

GET /health
→ {
  "status": "healthy",
  "version": "1.0.0"
}
```

---

## 📊 Códigos HTTP

| Código | Significado |
|--------|------------|
| 200 | ✅ OK - Operación exitosa |
| 201 | ✅ Created - Recurso creado |
| 204 | ✅ No Content - Operación exitosa (sin contenido) |
| 400 | ❌ Bad Request - Datos inválidos |
| 404 | ❌ Not Found - Recurso no encontrado |
| 422 | ❌ Validation Error - Error de validación Pydantic |
| 500 | ❌ Internal Server Error - Error del servidor |

---

## 🔗 Relaciones

```
Cliente
├── 1:1 → Usuario (autenticación)
└── 1:N → Reserva (múltiples reservas por cliente)

Empleado
├── 1:1 → Usuario (autenticación)
├── N:N → Rol (múltiples roles)
└── 1:N → Reserva (reservas asignadas)

Hotel
├── 1:N → Habitacion
├── N:N → Caracteristica
└── N:N → Paquete

Habitacion
└── N:N → Reserva (via ReservaHabitacion)

Reserva
├── N:1 → Cliente
├── N:1 → Empleado (nullable)
├── N:1 → Paquete (nullable)
├── N:N → Habitacion (via ReservaHabitacion)
├── N:N → Servicio (via ReservaServicio)
├── 1:N → Pago
└── 1:N → HistorialReserva
```

---

## ✨ Características Especiales

### Emails Automáticos

- ✅ **POST /clientes/** → Email de bienvenida
- ✅ **POST /reservas/** → Email de confirmación
- ✅ **PATCH /reservas/{id}/cancelar** → Email de cancelación

### Historial de Cambios

- ✅ **PATCH /reservas/{id}/confirmar** → Registra cambio en historial
- ✅ **PATCH /reservas/{id}/cancelar** → Registra cambio en historial

### Estadísticas

- ✅ **GET /empleados/stats/total** → Total, activos, inactivos
- ✅ **GET /hoteles/stats/total** → Total de hoteles
- ✅ **GET /reservas/stats/total** → Por estado
- ✅ **GET /reservas/{id}/ingresos** → Total de pagos

---

## 🧪 Ejemplos Curl

### Crear Cliente

```bash
curl -X POST "http://localhost:8000/clientes/" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "cedula": "123456789",
    "correo": "juan@example.com"
  }'
```

### Listar Clientes

```bash
curl "http://localhost:8000/clientes/?skip=0&limit=10"
```

### Crear Reserva

```bash
curl -X POST "http://localhost:8000/reservas/" \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 1,
    "fecha_inicio": "2026-06-10",
    "fecha_fin": "2026-06-15",
    "numero_personas": 2,
    "habitaciones": [],
    "servicios": []
  }'
```

### Confirmar Reserva

```bash
curl -X PATCH "http://localhost:8000/reservas/1/confirmar?empleado_id=1"
```

---

**Acceder a Swagger UI:** http://localhost:8000/docs

**Acceder a ReDoc:** http://localhost:8000/redoc
