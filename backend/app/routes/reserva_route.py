from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import ReservaDependencyError, PaqueteDependencyError, NotFoundError
from app.schemas.reserva_schema import (
    PaqueteCreate, PaqueteUpdate, PaqueteResponse,
    ReservaCreate, ReservaUpdate, ReservaResponse, ReservaDetailResponse,
    PagoCreate, PagoUpdate, PagoResponse,
    MetodoPagoCreate, MetodoPagoResponse
)
from app.repositories.reserva_repository import (
    PaqueteRepository, ReservaRepository, PagoRepository, MetodoPagoRepository
)

router = APIRouter(prefix="/api", tags=["Reservas, Paquetes y Pagos"])


# ===================== PAQUETES CRUD =====================

@router.get("/paquetes", response_model=list[PaqueteResponse])
def get_paquetes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene lista de paquetes activos"""
    return PaqueteRepository.get_all(db, skip, limit)


@router.get("/paquetes/{paquete_id}", response_model=PaqueteResponse)
def get_paquete(paquete_id: int, db: Session = Depends(get_db)):
    """Obtiene detalles de un paquete"""
    paquete = PaqueteRepository.get_by_id(db, paquete_id)
    if not paquete:
        raise HTTPException(status_code=404, detail="Paquete no encontrado")
    return paquete


@router.post("/paquetes", response_model=PaqueteResponse, status_code=201)
def create_paquete(paquete: PaqueteCreate, db: Session = Depends(get_db)):
    """Crea un nuevo paquete turístico"""
    return PaqueteRepository.create(db, paquete.dict())


@router.put("/paquetes/{paquete_id}", response_model=PaqueteResponse)
def update_paquete(paquete_id: int, paquete: PaqueteUpdate, db: Session = Depends(get_db)):
    """Actualiza un paquete existente"""
    db_paquete = PaqueteRepository.get_by_id(db, paquete_id)
    if not db_paquete:
        raise HTTPException(status_code=404, detail="Paquete no encontrado")
    
    return PaqueteRepository.update(db, paquete_id, paquete.dict(exclude_unset=True))


@router.delete("/paquetes/{paquete_id}")
def delete_paquete(paquete_id: int, db: Session = Depends(get_db)):
    """Desactiva un paquete"""
    try:
        PaqueteRepository.delete(db, paquete_id)
        return {"message": "Paquete desactivado exitosamente"}
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=e.detail)
    except PaqueteDependencyError as e:
        raise HTTPException(status_code=409, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===================== RESERVAS CRUD =====================

@router.get("/reservas", response_model=list[ReservaResponse])
def get_reservas(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene lista de reservas"""
    return ReservaRepository.get_all(db, skip, limit)


@router.get("/reservas/cliente/{cliente_id}", response_model=list[ReservaResponse])
def get_reservas_cliente(
    cliente_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene reservas de un cliente"""
    return ReservaRepository.get_by_cliente(db, cliente_id, skip, limit)


@router.get("/reservas/estado/{estado}", response_model=list[ReservaResponse])
def get_reservas_estado(
    estado: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene reservas por estado"""
    if estado not in ["pendiente", "confirmada", "cancelada", "finalizada"]:
        raise HTTPException(status_code=400, detail="Estado inválido")
    
    return ReservaRepository.get_by_estado(db, estado, skip, limit)


@router.get("/reservas/{reserva_id}", response_model=ReservaDetailResponse)
def get_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """Obtiene detalles completos de una reserva con paquete y pagos"""
    reserva = ReservaRepository.get_by_id(db, reserva_id)
    if not reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return reserva


@router.post("/reservas", response_model=ReservaResponse, status_code=201)
def create_reserva(reserva: ReservaCreate, db: Session = Depends(get_db)):
    """Crea una nueva reserva"""
    return ReservaRepository.create(db, reserva.dict())


@router.put("/reservas/{reserva_id}", response_model=ReservaResponse)
def update_reserva(reserva_id: int, reserva: ReservaUpdate, db: Session = Depends(get_db)):
    """Actualiza una reserva existente"""
    db_reserva = ReservaRepository.get_by_id(db, reserva_id)
    if not db_reserva:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    
    return ReservaRepository.update(db, reserva_id, reserva.dict(exclude_unset=True))


@router.delete("/reservas/{reserva_id}")
def delete_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """Elimina una reserva"""
    try:
        ReservaRepository.delete(db, reserva_id)
        return {"message": "Reserva eliminada exitosamente"}
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=e.detail)
    except ReservaDependencyError as e:
        raise HTTPException(status_code=409, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===================== MÉTODOS DE PAGO CRUD =====================

@router.get("/metodos-pago", response_model=list[MetodoPagoResponse])
def get_metodos_pago(db: Session = Depends(get_db)):
    """Obtiene todos los métodos de pago disponibles"""
    return MetodoPagoRepository.get_all(db)


@router.post("/metodos-pago", response_model=MetodoPagoResponse, status_code=201)
def create_metodo_pago(metodo: MetodoPagoCreate, db: Session = Depends(get_db)):
    """Crea un nuevo método de pago"""
    return MetodoPagoRepository.create(db, metodo.dict())


# ===================== PAGOS CRUD =====================

@router.get("/pagos", response_model=list[PagoResponse])
def get_pagos(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene lista de pagos"""
    return PagoRepository.get_all(db, skip, limit)


@router.get("/pagos/reserva/{reserva_id}", response_model=list[PagoResponse])
def get_pagos_reserva(reserva_id: int, db: Session = Depends(get_db)):
    """Obtiene pagos de una reserva"""
    return PagoRepository.get_by_reserva(db, reserva_id)


@router.get("/pagos/estado/{estado}", response_model=list[PagoResponse])
def get_pagos_estado(
    estado: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene pagos por estado"""
    if estado not in ["pendiente", "pagado", "rechazado"]:
        raise HTTPException(status_code=400, detail="Estado inválido")
    
    return PagoRepository.get_by_estado(db, estado, skip, limit)


@router.get("/pagos/{pago_id}", response_model=PagoResponse)
def get_pago(pago_id: int, db: Session = Depends(get_db)):
    """Obtiene detalles de un pago"""
    pago = PagoRepository.get_by_id(db, pago_id)
    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    return pago


@router.post("/pagos", response_model=PagoResponse, status_code=201)
def create_pago(pago: PagoCreate, db: Session = Depends(get_db)):
    """Crea un nuevo pago"""
    return PagoRepository.create(db, pago.dict())


@router.put("/pagos/{pago_id}", response_model=PagoResponse)
def update_pago(pago_id: int, pago: PagoUpdate, db: Session = Depends(get_db)):
    """Actualiza un pago existente"""
    db_pago = PagoRepository.get_by_id(db, pago_id)
    if not db_pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    
    return PagoRepository.update(db, pago_id, pago.dict(exclude_unset=True))


@router.delete("/pagos/{pago_id}")
def delete_pago(pago_id: int, db: Session = Depends(get_db)):
    """Elimina un pago"""
    try:
        PagoRepository.delete(db, pago_id)
        return {"message": "Pago eliminado exitosamente"}
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
