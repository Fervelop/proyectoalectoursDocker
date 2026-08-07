from sqlalchemy import Column, Integer, String, Boolean, Date, TIMESTAMP, ForeignKey, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Cliente(Base):
    __tablename__ = "clientes"

    id_cliente = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    cedula = Column(String(20), unique=True, nullable=False)
    correo = Column(String(100), unique=True)
    celular = Column(String(20))
    direccion = Column(String(255))
    ciudad = Column(String(100))
    pais = Column(String(100))
    fecha_nacimiento = Column(Date)
    fecha_registro = Column(TIMESTAMP, server_default=func.now())

    reservas = relationship("Reserva", back_populates="cliente")
    usuario = relationship("Usuario", back_populates="cliente", uselist=False, foreign_keys="Usuario.id_cliente")
    preferencias = relationship("PreferenciaCliente", back_populates="cliente", uselist=False)


class Empleado(Base):
    __tablename__ = "empleados"

    id_empleado = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    cedula = Column(String(20), unique=True, nullable=False)
    correo_electronico = Column(String(100), unique=True)
    celular = Column(String(20))
    direccion = Column(String(255))
    ciudad = Column(String(100))
    pais = Column(String(100))
    fecha_nacimiento = Column(Date)
    fecha_contratacion = Column(Date)
    activo = Column(Boolean, default=True)

    reservas = relationship("Reserva", back_populates="empleado")
    usuario = relationship("Usuario", back_populates="empleado", uselist=False, foreign_keys="Usuario.id_empleado")
    historial_reservas = relationship("HistorialReserva", back_populates="empleado_responsable")


class PreferenciaCliente(Base):
    __tablename__ = "preferencias_cliente"

    id_preferencia = Column(Integer, primary_key=True, index=True)
    id_cliente = Column(Integer, ForeignKey("clientes.id_cliente"), unique=True, nullable=False)
    intereses = Column(ARRAY(String))
    compania = Column(String(20))
    presupuesto = Column(String(20))
    clima = Column(String(20))
    ritmo = Column(String(20))
    transporte = Column(String(20))
    fecha_creacion = Column(TIMESTAMP, server_default=func.now())
    fecha_actualizacion = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

    cliente = relationship("Cliente", back_populates="preferencias")