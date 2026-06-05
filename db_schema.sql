-- Script SQL completo para AlecTours DB
-- Ejecutar después de crear la base de datos

CREATE DATABASE alektours_db;

-- Conectarse a la BD antes de ejecutar lo siguiente
\c alektours_db;

-- =====================================================================
-- TABLAS BASE
-- =====================================================================

CREATE TABLE IF NOT EXISTS hoteles (
    id_hotel SERIAL PRIMARY KEY,
    nombre_hotel VARCHAR(100) NOT NULL,
    calificacion INTEGER CHECK (calificacion BETWEEN 1 AND 5),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    codigo_postal VARCHAR(20),
    correo_electronico VARCHAR(100),
    telefono VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS caracteristicas_hotel (
    id_caracteristica SERIAL PRIMARY KEY,
    nombre_caracteristica VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS hotel_caracteristicas (
    id_hotel INTEGER NOT NULL,
    id_caracteristica INTEGER NOT NULL,
    disponible BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_hotel, id_caracteristica),
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id_hotel) ON DELETE CASCADE,
    FOREIGN KEY (id_caracteristica) REFERENCES caracteristicas_hotel(id_caracteristica) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tipo_habitacion (
    id_tipo_habitacion SERIAL PRIMARY KEY,
    nombre_tipo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(200),
    capacidad_personas INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS habitaciones (
    id_habitacion SERIAL PRIMARY KEY,
    id_hotel INTEGER NOT NULL,
    id_tipo_habitacion INTEGER NOT NULL,
    numero_habitacion VARCHAR(20) NOT NULL,
    precio_noche NUMERIC(10,2) NOT NULL CHECK (precio_noche >= 0),
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('disponible', 'ocupada', 'mantenimiento')),
    UNIQUE(id_hotel, numero_habitacion),
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id_hotel) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_habitacion) REFERENCES tipo_habitacion(id_tipo_habitacion)
);

CREATE TABLE IF NOT EXISTS clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    correo VARCHAR(100) UNIQUE,
    celular VARCHAR(20),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    fecha_nacimiento DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS empleados (
    id_empleado SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE,
    celular VARCHAR(20),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    fecha_nacimiento DATE,
    fecha_contratacion DATE,
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    correo_electronico VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    id_cliente INTEGER UNIQUE,
    id_empleado INTEGER UNIQUE,
    activo BOOLEAN DEFAULT TRUE,
    verificado BOOLEAN DEFAULT FALSE,
    ultimo_login TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE,
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS usuarios_roles (
    id_usuario INTEGER NOT NULL,
    id_rol INTEGER NOT NULL,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_rol) REFERENCES roles(id_rol) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS sesiones_usuario (
    id_sesion SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    refresh_token TEXT NOT NULL,
    direccion_ip VARCHAR(50),
    user_agent TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recuperacion_password (
    id_recuperacion SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    token_recuperacion TEXT NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS destinos (
    id_destino SERIAL PRIMARY KEY,
    nombre_destino VARCHAR(100) NOT NULL,
    descripcion TEXT,
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    temporada_alta_inicio DATE,
    temporada_alta_fin DATE
);

CREATE TABLE IF NOT EXISTS categoria_servicio (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS servicios (
    id_servicio SERIAL PRIMARY KEY,
    nombre_servicio VARCHAR(100) NOT NULL,
    descripcion TEXT,
    id_categoria INTEGER,
    id_destino INTEGER,
    duracion_horas NUMERIC(4,1),
    precio_base NUMERIC(10,2) CHECK (precio_base >= 0),
    capacidad_maxima INTEGER CHECK (capacidad_maxima > 0),
    FOREIGN KEY (id_categoria) REFERENCES categoria_servicio(id_categoria),
    FOREIGN KEY (id_destino) REFERENCES destinos(id_destino)
);

CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL,
    tipo_proveedor VARCHAR(50),
    contacto VARCHAR(100),
    telefono VARCHAR(20),
    correo_electronico VARCHAR(100),
    direccion VARCHAR(255),
    ciudad VARCHAR(100),
    pais VARCHAR(100),
    comision_porcentaje NUMERIC(5,2)
);

CREATE TABLE IF NOT EXISTS servicio_proveedor (
    id_servicio INTEGER NOT NULL,
    id_proveedor INTEGER NOT NULL,
    precio_proveedor NUMERIC(10,2),
    es_proveedor_principal BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_servicio, id_proveedor),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paquetes (
    id_paquete SERIAL PRIMARY KEY,
    nombre_paquete VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion_dias INTEGER,
    precio_base NUMERIC(10,2) CHECK (precio_base >= 0),
    activo BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS paquete_servicios (
    id_paquete INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    dia_actividad INTEGER,
    incluido BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (id_paquete, id_servicio),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS paquete_hotel (
    id_paquete INTEGER NOT NULL,
    id_hotel INTEGER NOT NULL,
    noches_incluidas INTEGER,
    PRIMARY KEY (id_paquete, id_hotel),
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete) ON DELETE CASCADE,
    FOREIGN KEY (id_hotel) REFERENCES hoteles(id_hotel) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reservas (
    id_reserva SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_empleado INTEGER,
    id_paquete INTEGER,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio DATE,
    fecha_fin DATE,
    numero_personas INTEGER CHECK (numero_personas > 0),
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'finalizada')),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_empleado) REFERENCES empleados(id_empleado) ON DELETE SET NULL,
    FOREIGN KEY (id_paquete) REFERENCES paquetes(id_paquete) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reserva_habitaciones (
    id_reserva INTEGER NOT NULL,
    id_habitacion INTEGER NOT NULL,
    fecha_checkin DATE,
    fecha_checkout DATE,
    precio_acordado NUMERIC(10,2),
    PRIMARY KEY (id_reserva, id_habitacion),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_habitacion) REFERENCES habitaciones(id_habitacion)
);

CREATE TABLE IF NOT EXISTS reserva_servicios (
    id_reserva INTEGER NOT NULL,
    id_servicio INTEGER NOT NULL,
    fecha_servicio DATE,
    numero_personas INTEGER,
    precio_acordado NUMERIC(10,2),
    PRIMARY KEY (id_reserva, id_servicio),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_servicio) REFERENCES servicios(id_servicio)
);

CREATE TABLE IF NOT EXISTS metodos_pago (
    id_metodo SERIAL PRIMARY KEY,
    nombre_metodo VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS pagos (
    id_pago SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL,
    id_metodo_pago INTEGER NOT NULL,
    monto NUMERIC(10,2) NOT NULL CHECK (monto >= 0),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    referencia VARCHAR(100),
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'pagado', 'rechazado')),
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id_metodo)
);

CREATE TABLE IF NOT EXISTS historial_reservas (
    id_historial SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL,
    estado_anterior VARCHAR(20),
    estado_nuevo VARCHAR(20),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_empleado_responsable INTEGER,
    comentarios TEXT,
    FOREIGN KEY (id_reserva) REFERENCES reservas(id_reserva) ON DELETE CASCADE,
    FOREIGN KEY (id_empleado_responsable) REFERENCES empleados(id_empleado) ON DELETE SET NULL
);

-- =====================================================================
-- ÍNDICES
-- =====================================================================

CREATE INDEX IF NOT EXISTS idx_reservas_cliente ON reservas(id_cliente);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
CREATE INDEX IF NOT EXISTS idx_habitaciones_hotel ON habitaciones(id_hotel);
CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);
CREATE INDEX IF NOT EXISTS idx_usuarios_correo ON usuarios(correo_electronico);

-- =====================================================================
-- DATOS INICIALES
-- =====================================================================

INSERT INTO roles (nombre_rol) VALUES ('admin'), ('cliente'), ('empleado') ON CONFLICT (nombre_rol) DO NOTHING;

INSERT INTO metodos_pago (nombre_metodo) VALUES ('Tarjeta de Crédito'), ('Tarjeta de Débito'), ('Transferencia Bancaria'), ('PayPal') ON CONFLICT DO NOTHING;
