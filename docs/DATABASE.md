# Database Configuration and Management

Guía para trabajar con PostgreSQL, Alembic y migraciones.

---

## 🔌 Conexión a PostgreSQL

La conexión se configura en `backend/.env`:

```env
DATABASE_URL=postgresql+psycopg://admin:admin123@postgres:5432/alektours_db
```

**Partes:**
- `postgresql+psycopg` — Driver de PostgreSQL
- `admin:admin123` — Usuario:Password
- `postgres` — Host (nombre del servicio en Docker)
- `5432` — Puerto estándar
- `alektours_db` — Nombre de la BD

---

## 📝 Modelos SQLAlchemy

Todos los modelos heredan de `Base`:

```python
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "usuarios"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    nombre = Column(String(100))
    apellido = Column(String(100))
    contraseña = Column(String(255))
    activo = Column(Boolean, default=True)
    fecha_creacion = Column(DateTime, server_default=func.now())
    
    # Relación con otras tablas
    # reservas = relationship("Reservation", back_populates="usuario")
```

**Tipos de datos comunes:**
- `Integer` — Números enteros
- `String(n)` — Texto de máximo n caracteres
- `Boolean` — Verdadero/Falso
- `DateTime` — Fecha y hora
- `Numeric(10,2)` — Números decimales
- `Float` — Números flotantes

**Constraints:**
- `primary_key=True` — Clave primaria
- `unique=True` — Valor único
- `nullable=False` (default) — No puede ser NULL
- `index=True` — Crear índice para búsquedas rápidas
- `default=value` — Valor por defecto
- `ForeignKey("tabla.columna")` — Referencia a otra tabla

---

## 🔄 Migraciones con Alembic

### Estructura

```
backend/
  alembic/
    versions/
      001_create_users.py
      002_add_hotels.py
      env.py
    script.py.mako
    alembic.ini
```

### Crear Migración

```bash
cd backend

# Generar automáticamente (recomendado)
alembic revision --autogenerate -m "Create user table"

# O crear manual
alembic revision -m "Create user table"
```

Esto crea un archivo en `alembic/versions/` con las instrucciones SQL.

### Ejecutar Migraciones

```bash
# Subir todas las migraciones
alembic upgrade head

# Subir N migraciones
alembic upgrade +2

# Bajar 1 migración
alembic downgrade -1

# Ver historial
alembic history

# Ver estado actual
alembic current
```

### Estructura de Migración

```python
"""Create user table

Revision ID: 001
Revises: 
Create Date: 2026-06-03 10:30:00.000000
"""

from alembic import op
import sqlalchemy as sa

# Identificadores
revision = '001'
down_revision = None

def upgrade():
    """Aplicar migración"""
    op.create_table(
        'usuarios',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(100), nullable=False, unique=True),
        sa.Column('nombre', sa.String(100), nullable=False),
        sa.Column('contraseña', sa.String(255), nullable=False),
        sa.Column('activo', sa.Boolean(), default=True),
        sa.Column('fecha_creacion', sa.DateTime()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_usuarios_email'), 'usuarios', ['email'])

def downgrade():
    """Revertir migración"""
    op.drop_table('usuarios')
```

---

## 🔍 Queries Comunes

### Seleccionar

```python
from app.core.database import get_db

@router.get("/users")
async def list_users(db: Session = Depends(get_db)):
    # Todos
    users = db.query(User).all()
    
    # Uno específico
    user = db.query(User).filter(User.id == 1).first()
    
    # Con condiciones múltiples
    user = db.query(User).filter(
        (User.email == "juan@example.com") &
        (User.activo == True)
    ).first()
    
    # Contar
    count = db.query(User).count()
    
    # Paginación
    users = db.query(User).offset(10).limit(5).all()
    
    return users
```

### Insertar

```python
user = User(
    email="juan@example.com",
    nombre="Juan",
    contraseña=hash_password("password")
)
db.add(user)
db.commit()
db.refresh(user)  # Recargar desde BD para obtener ID

return {"id": user.id, "email": user.email}
```

### Actualizar

```python
user = db.query(User).filter(User.id == 1).first()

if user:
    user.nombre = "Nuevo Nombre"
    db.commit()
    db.refresh(user)
```

### Eliminar

```python
user = db.query(User).filter(User.id == 1).first()

if user:
    db.delete(user)
    db.commit()
```

---

## 🔗 Relaciones Entre Tablas

### One-to-Many (1:N)

```python
class Hotel(Base):
    __tablename__ = "hoteles"
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    # relationship
    habitaciones = relationship("Room", back_populates="hotel")

class Room(Base):
    __tablename__ = "habitaciones"
    id = Column(Integer, primary_key=True)
    hotel_id = Column(Integer, ForeignKey("hoteles.id"), nullable=False)
    numero = Column(String)
    # relationship
    hotel = relationship("Hotel", back_populates="habitaciones")
```

**Uso:**
```python
hotel = db.query(Hotel).filter(Hotel.id == 1).first()

# Acceder a habitaciones del hotel
for room in hotel.habitaciones:
    print(room.numero)

# Crear habitación para hotel
room = Room(numero="101", hotel_id=hotel.id)
db.add(room)
db.commit()
```

### Many-to-Many (N:N)

```python
# Tabla de unión
hotel_caracteristicas = Table(
    'hotel_caracteristicas',
    Base.metadata,
    Column('hotel_id', Integer, ForeignKey('hoteles.id'), primary_key=True),
    Column('caracteristica_id', Integer, ForeignKey('caracteristicas.id'), primary_key=True)
)

class Hotel(Base):
    __tablename__ = "hoteles"
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    # relationship
    caracteristicas = relationship(
        "Caracteristica",
        secondary=hotel_caracteristicas,
        back_populates="hoteles"
    )

class Caracteristica(Base):
    __tablename__ = "caracteristicas"
    id = Column(Integer, primary_key=True)
    nombre = Column(String)
    # relationship
    hoteles = relationship(
        "Hotel",
        secondary=hotel_caracteristicas,
        back_populates="caracteristicas"
    )
```

**Uso:**
```python
hotel = db.query(Hotel).filter(Hotel.id == 1).first()

# Agregar característica
caracteristica = db.query(Caracteristica).filter(Caracteristica.id == 5).first()
hotel.caracteristicas.append(caracteristica)
db.commit()

# Listar características del hotel
for char in hotel.caracteristicas:
    print(char.nombre)
```

---

## ⚙️ Transacciones

```python
from sqlalchemy import event

try:
    # Operación 1
    user = User(email="juan@example.com")
    db.add(user)
    
    # Operación 2
    hotel = Hotel(nombre="Paradise")
    db.add(hotel)
    
    # Si todo va bien
    db.commit()
    
except Exception as e:
    # Si algo falla, revertir TODO
    db.rollback()
    raise HTTPException(status_code=500, detail=str(e))
```

---

## 📊 Backups

### Crear Backup

```bash
docker compose exec postgres pg_dump -U admin alektours_db > backup.sql
```

### Restaurar Backup

```bash
docker compose exec postgres psql -U admin alektours_db < backup.sql
```

### Backup Completo (Volumen)

```bash
# Copiar volumen de datos
docker cp postgres_db:/var/lib/postgresql/data ./postgres_backup
```

---

## 🔑 Índices

Los índices aceleran búsquedas pero ralentizan inserciones.

```python
class User(Base):
    __tablename__ = "usuarios"
    id = Column(Integer, primary_key=True)
    email = Column(String, index=True)  # ✓ Índice en email
    nombre = Column(String)  # Sin índice
```

**Crear índice en migración:**
```python
def upgrade():
    op.create_index('ix_usuarios_email', 'usuarios', ['email'])

def downgrade():
    op.drop_index('ix_usuarios_email')
```

---

## 🚨 Troubleshooting

### Error: "relation does not exist"
```bash
# Migraciones no se ejecutaron
alembic upgrade head
```

### Error: "duplicate key value"
```python
# Intentas insertar un valor que ya existe en columna unique
# Solución: verificar antes de insertar
existing = db.query(User).filter(User.email == email).first()
if existing:
    raise HTTPException(status_code=400, detail="Email exists")
```

### Error: "foreign key constraint"
```python
# Intentas referenciar una fila que no existe
# Solución: verificar que el ID existe
hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
if not hotel:
    raise HTTPException(status_code=404, detail="Hotel not found")
```

---

**Ver también:** [INDEX.md](INDEX.md) | [SCHEMA.sql](SCHEMA.sql) | [CORE_README.md](CORE_README.md)
