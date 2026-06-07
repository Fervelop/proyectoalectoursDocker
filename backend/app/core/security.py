"""
Módulo de seguridad: autenticación JWT, hashing de contraseñas y autorización.
"""

from datetime import datetime, timedelta, timezone
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

# Contexto para hash de contraseñas con bcrypt
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    """
    Hash una contraseña usando bcrypt.
    
    Args:
        password: Contraseña en texto plano
        
    Returns:
        Contraseña hasheada
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica una contraseña contra su hash.
    
    Args:
        plain_password: Contraseña en texto plano
        hashed_password: Hash de la contraseña almacenado
        
    Returns:
        True si la contraseña coincide, False en caso contrario
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Crea un token JWT de acceso.
    
    Args:
        data: Datos a incluir en el token
        expires_delta: Duración del token (por defecto usa ACCESS_TOKEN_EXPIRE_MINUTES)
        
    Returns:
        Token JWT codificado
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """
    Crea un token JWT de refresco (validez más larga).
    
    Args:
        data: Datos a incluir en el token
        
    Returns:
        Token JWT de refresco codificado
    """
    to_encode = data.copy()
    
    # Tokens de refresco válidos por 7 días
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """
    Decodifica y valida un token JWT.
    
    Args:
        token: Token JWT a decodificar
        
    Returns:
        Datos del token si es válido, None si es inválido o expirado
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None


def get_user_from_token(token: str) -> Optional[int]:
    """
    Extrae el ID del usuario desde un token JWT válido.
    
    Args:
        token: Token JWT
        
    Returns:
        ID del usuario si el token es válido, None en caso contrario
    """
    payload = decode_token(token)
    
    if payload is None:
        return None
    
    user_id = payload.get("sub")
    
    if user_id is None:
        return None
    
    try:
        return int(user_id)
    except (ValueError, TypeError):
        return None


def generate_token_pair(user_id: int) -> dict:
    """
    Genera un par de tokens (acceso y refresco) para un usuario.
    
    Args:
        user_id: ID del usuario
        
    Returns:
        Diccionario con 'access_token' y 'refresh_token'
    """
    access_token = create_access_token(data={"sub": str(user_id)})
    refresh_token = create_refresh_token(data={"sub": str(user_id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


def create_verification_token(email: str) -> str:
    """
    Crea un token de verificación de email.
    
    Args:
        email: Email del usuario
        
    Returns:
        Token de verificación válido por 24 horas
    """
    to_encode = {
        "email": email,
        "type": "verification"
    }
    
    # Token válido por 24 horas
    expire = datetime.now(timezone.utc) + timedelta(hours=24)
    to_encode.update({"exp": expire})
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt


def verify_verification_token(token: str) -> Optional[str]:
    """
    Verifica un token de verificación de email.
    
    Args:
        token: Token de verificación
        
    Returns:
        Email si el token es válido, None si es inválido o expirado
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        # Verificar que es un token de verificación
        if payload.get("type") != "verification":
            return None
            
        email = payload.get("email")
        return email
    except JWTError:
        return None


def get_current_user(authorization: Optional[str] = None) -> Optional[int]:
    """
    Extrae y valida el usuario del header Authorization.
    
    Args:
        authorization: Header Authorization con formato "Bearer <token>"
        
    Returns:
        user_id si el token es válido, None si es inválido
    """
    from fastapi import HTTPException
    
    if not authorization:
        raise HTTPException(status_code=401, detail="No autenticado")
    
    # Extraer el token del header "Authorization: Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Token inválido")
    
    token = parts[1]
    user_id = get_user_from_token(token)
    
    if user_id is None:
        raise HTTPException(status_code=401, detail="Token expirado o inválido")
    
    return user_id
