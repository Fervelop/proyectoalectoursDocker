from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.exceptions import ClienteDependencyError, EmpleadoDependencyError, NotFoundError
from app.schemas.cliente_schema import ClienteCreate, ClienteUpdate, ClienteResponse, EmpleadoCreate, EmpleadoUpdate, EmpleadoResponse
from app.repositories.cliente_repository import ClienteRepository, EmpleadoRepository

router = APIRouter(prefix="/api", tags=["Clientes y Empleados"])


# ===================== CLIENTES CRUD =====================

@router.get("/clientes", response_model=list[ClienteResponse])
def get_clientes(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene lista de clientes"""
    return ClienteRepository.get_all(db, skip, limit)


@router.get("/clientes/{cliente_id}", response_model=ClienteResponse)
def get_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Obtiene detalles de un cliente"""
    cliente = ClienteRepository.get_by_id(db, cliente_id)
    if not cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return cliente


@router.post("/clientes", response_model=ClienteResponse, status_code=201)
def create_cliente(cliente: ClienteCreate, db: Session = Depends(get_db)):
    """Crea un nuevo cliente"""
    existente = ClienteRepository.get_by_cedula(db, cliente.cedula)
    if existente:
        raise HTTPException(status_code=400, detail="Cliente con esa cédula ya existe")
    
    if cliente.correo:
        existente_email = ClienteRepository.get_by_email(db, cliente.correo)
        if existente_email:
            raise HTTPException(status_code=400, detail="Email ya registrado")
    
    return ClienteRepository.create(db, cliente.dict())


@router.put("/clientes/{cliente_id}", response_model=ClienteResponse)
def update_cliente(cliente_id: int, cliente: ClienteUpdate, db: Session = Depends(get_db)):
    """Actualiza un cliente existente"""
    db_cliente = ClienteRepository.get_by_id(db, cliente_id)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    
    return ClienteRepository.update(db, cliente_id, cliente.dict(exclude_unset=True))


@router.delete("/clientes/{cliente_id}")
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    """Elimina un cliente"""
    try:
        ClienteRepository.delete(db, cliente_id)
        return {"message": "Cliente eliminado exitosamente"}
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=e.detail)
    except ClienteDependencyError as e:
        raise HTTPException(status_code=409, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ===================== EMPLEADOS CRUD =====================

@router.get("/empleados", response_model=list[EmpleadoResponse])
def get_empleados(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene lista de empleados"""
    return EmpleadoRepository.get_all(db, skip, limit)


@router.get("/empleados/activos/lista", response_model=list[EmpleadoResponse])
def get_empleados_activos(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Obtiene lista de empleados activos"""
    return EmpleadoRepository.get_activos(db, skip, limit)


@router.get("/empleados/{empleado_id}", response_model=EmpleadoResponse)
def get_empleado(empleado_id: int, db: Session = Depends(get_db)):
    """Obtiene detalles de un empleado"""
    empleado = EmpleadoRepository.get_by_id(db, empleado_id)
    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return empleado


@router.post("/empleados", response_model=EmpleadoResponse, status_code=201)
def create_empleado(empleado: EmpleadoCreate, db: Session = Depends(get_db)):
    """Crea un nuevo empleado"""
    existente = EmpleadoRepository.get_by_cedula(db, empleado.cedula)
    if existente:
        raise HTTPException(status_code=400, detail="Empleado con esa cédula ya existe")
    
    if empleado.correo_electronico:
        existente_email = EmpleadoRepository.get_by_email(db, empleado.correo_electronico)
        if existente_email:
            raise HTTPException(status_code=400, detail="Email ya registrado")
    
    return EmpleadoRepository.create(db, empleado.dict())


@router.put("/empleados/{empleado_id}", response_model=EmpleadoResponse)
def update_empleado(empleado_id: int, empleado: EmpleadoUpdate, db: Session = Depends(get_db)):
    """Actualiza un empleado existente"""
    db_empleado = EmpleadoRepository.get_by_id(db, empleado_id)
    if not db_empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    
    return EmpleadoRepository.update(db, empleado_id, empleado.dict(exclude_unset=True))


@router.delete("/empleados/{empleado_id}")
def delete_empleado(empleado_id: int, db: Session = Depends(get_db)):
    """Elimina un empleado"""
    try:
        EmpleadoRepository.delete(db, empleado_id)
        return {"message": "Empleado eliminado exitosamente"}
    except NotFoundError as e:
        raise HTTPException(status_code=404, detail=e.detail)
    except EmpleadoDependencyError as e:
        raise HTTPException(status_code=409, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
