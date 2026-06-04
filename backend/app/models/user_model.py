from sqlalchemy import Column, Integer, String, Boolean, TIMESTAMP
from sqlalchemy.sql import func

from app.core.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id_usuario = Column(Integer, primary_key=True, index=True)

    username = Column(String(50), unique=True, nullable=False)

    correo_electronico = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password_hash = Column(String, nullable=False)

    activo = Column(Boolean, default=True)

    verificado = Column(Boolean, default=False)

    ultimo_login = Column(TIMESTAMP)

    fecha_creacion = Column(
        TIMESTAMP,
        server_default=func.now()
    )