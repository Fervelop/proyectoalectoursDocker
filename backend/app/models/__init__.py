# Importar todos los modelos aquí para asegurar que SQLAlchemy los registre
from app.models.user_model import Usuario
from app.models.cliente_model import Cliente, Empleado
from app.models.hotel_model import Hotel, Habitacion, Caracteristica, HotelCaracteristica, TipoHabitacion
from app.models.servicio_model import Servicio, Destino, CategoriaServicio, Proveedor, ServicioProveedor
from app.models.reserva_model import (
    Reserva, Paquete, Pago, MetodoPago, HistorialReserva,
    ReservaHabitacion, ReservaServicio, PaqueteServicio, PaqueteHotel
)

__all__ = [
    "Usuario",
    "Cliente",
    "Empleado",
    "Hotel",
    "Habitacion",
    "Caracteristica",
    "HotelCaracteristica",
    "TipoHabitacion",
    "Servicio",
    "Destino",
    "CategoriaServicio",
    "Proveedor",
    "ServicioProveedor",
    "Reserva",
    "Paquete",
    "Pago",
    "MetodoPago",
    "HistorialReserva",
    "ReservaHabitacion",
    "ReservaServicio",
    "PaqueteServicio",
    "PaqueteHotel",
]