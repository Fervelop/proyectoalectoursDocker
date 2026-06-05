from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.reserva_model import Reserva, Paquete, Pago, MetodoPago, HistorialReserva, ReservaHabitacion, ReservaServicio
from app.core.exceptions import ReservaDependencyError, PaqueteDependencyError, NotFoundError


class PaqueteRepository:
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 10):
        return db.query(Paquete).filter(Paquete.activo == True).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, paquete_id: int):
        return db.query(Paquete).filter(Paquete.id_paquete == paquete_id).first()
    
    @staticmethod
    def create(db: Session, paquete_data: dict):
        paquete = Paquete(**paquete_data)
        db.add(paquete)
        db.commit()
        db.refresh(paquete)
        return paquete
    
    @staticmethod
    def update(db: Session, paquete_id: int, paquete_data: dict):
        paquete = db.query(Paquete).filter(Paquete.id_paquete == paquete_id).first()
        if paquete:
            for key, value in paquete_data.items():
                if value is not None:
                    setattr(paquete, key, value)
            db.commit()
            db.refresh(paquete)
        return paquete
    
    @staticmethod
    def delete(db: Session, paquete_id: int):
        paquete = db.query(Paquete).filter(Paquete.id_paquete == paquete_id).first()
        if not paquete:
            raise NotFoundError(f"Paquete con ID {paquete_id} no encontrado")
        
        # Verificar si hay reservas usando este paquete
        reservas_count = db.query(func.count(Reserva.id_reserva)).filter(
            Reserva.id_paquete == paquete_id
        ).scalar() or 0
        
        if reservas_count > 0:
            raise PaqueteDependencyError(paquete_id, reservas_count)
        
        paquete.activo = False
        db.commit()
        db.refresh(paquete)
        return paquete


class ReservaRepository:
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 10):
        return db.query(Reserva).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, reserva_id: int):
        return db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()
    
    @staticmethod
    def get_by_cliente(db: Session, cliente_id: int, skip: int = 0, limit: int = 10):
        return db.query(Reserva).filter(Reserva.id_cliente == cliente_id).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_estado(db: Session, estado: str, skip: int = 0, limit: int = 10):
        return db.query(Reserva).filter(Reserva.estado == estado).offset(skip).limit(limit).all()
    
    @staticmethod
    def create(db: Session, reserva_data: dict):
        reserva = Reserva(**reserva_data, estado="pendiente")
        db.add(reserva)
        db.commit()
        db.refresh(reserva)
        return reserva
    
    @staticmethod
    def update(db: Session, reserva_id: int, reserva_data: dict):
        reserva = db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()
        if reserva:
            for key, value in reserva_data.items():
                if value is not None:
                    setattr(reserva, key, value)
            db.commit()
            db.refresh(reserva)
        return reserva
    
    @staticmethod
    def delete(db: Session, reserva_id: int):
        reserva = db.query(Reserva).filter(Reserva.id_reserva == reserva_id).first()
        if not reserva:
            raise NotFoundError(f"Reserva con ID {reserva_id} no encontrada")
        
        # Verificar si tiene pagos
        pagos_count = db.query(func.count(Pago.id_pago)).filter(
            Pago.id_reserva == reserva_id
        ).scalar() or 0
        
        # Verificar si tiene habitaciones asignadas
        habitaciones_count = db.query(func.count(ReservaHabitacion.id_reserva)).filter(
            ReservaHabitacion.id_reserva == reserva_id
        ).scalar() or 0
        
        # Verificar si tiene servicios asignados
        servicios_count = db.query(func.count(ReservaServicio.id_reserva)).filter(
            ReservaServicio.id_reserva == reserva_id
        ).scalar() or 0
        
        if pagos_count > 0 or habitaciones_count > 0 or servicios_count > 0:
            raise ReservaDependencyError(reserva_id, pagos_count, habitaciones_count, servicios_count)
        
        db.delete(reserva)
        db.commit()
        return reserva


class PagoRepository:
    
    @staticmethod
    def get_all(db: Session, skip: int = 0, limit: int = 10):
        return db.query(Pago).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_by_id(db: Session, pago_id: int):
        return db.query(Pago).filter(Pago.id_pago == pago_id).first()
    
    @staticmethod
    def get_by_reserva(db: Session, reserva_id: int):
        return db.query(Pago).filter(Pago.id_reserva == reserva_id).all()
    
    @staticmethod
    def get_by_estado(db: Session, estado: str, skip: int = 0, limit: int = 10):
        return db.query(Pago).filter(Pago.estado == estado).offset(skip).limit(limit).all()
    
    @staticmethod
    def create(db: Session, pago_data: dict):
        pago = Pago(**pago_data, estado="pendiente")
        db.add(pago)
        db.commit()
        db.refresh(pago)
        return pago
    
    @staticmethod
    def update(db: Session, pago_id: int, pago_data: dict):
        pago = db.query(Pago).filter(Pago.id_pago == pago_id).first()
        if pago:
            for key, value in pago_data.items():
                if value is not None:
                    setattr(pago, key, value)
            db.commit()
            db.refresh(pago)
        return pago
    
    @staticmethod
    def delete(db: Session, pago_id: int):
        pago = db.query(Pago).filter(Pago.id_pago == pago_id).first()
        if pago:
            db.delete(pago)
            db.commit()
        return pago


class MetodoPagoRepository:
    
    @staticmethod
    def get_all(db: Session):
        return db.query(MetodoPago).all()
    
    @staticmethod
    def get_by_id(db: Session, metodo_id: int):
        return db.query(MetodoPago).filter(MetodoPago.id_metodo == metodo_id).first()
    
    @staticmethod
    def create(db: Session, metodo_data: dict):
        metodo = MetodoPago(**metodo_data)
        db.add(metodo)
        db.commit()
        db.refresh(metodo)
        return metodo
