# services/auth_service.py

from sqlalchemy.orm import Session

from app.repositories.user_repository import (
    get_user_by_username,
    create_user
)

from app.core.security import (
    hash_password,
    verify_password,
    generate_token_pair,
    create_verification_token,
    verify_verification_token
)

from app.core.mail import send_verification_email


def register_user(db: Session, username: str, email: str, password: str):
    """
    Registra un nuevo usuario en el sistema y envía email de verificación
    
    Args:
        db: Sesión de base de datos
        username: Nombre de usuario (debe ser único)
        email: Correo electrónico (debe ser único)
        password: Contraseña en texto plano
        
    Returns:
        Dict con tokens (access_token, refresh_token) o error
    """
    # Verificar que el usuario no exista
    existing_user = get_user_by_username(db, username)
    if existing_user:
        return {"error": "El nombre de usuario ya existe"}
    
    # Verificar que el email no esté registrado
    from app.models.user_model import Usuario
    existing_email = db.query(Usuario).filter(
        Usuario.correo_electronico == email
    ).first()
    if existing_email:
        return {"error": "El correo electrónico ya está registrado"}
    
    # Hashear la contraseña
    hashed_password = hash_password(password)
    
    # Crear el usuario
    user_data = {
        "username": username,
        "correo_electronico": email,
        "password_hash": hashed_password,
        "activo": True,
        "verificado": False
    }
    
    user = create_user(db, user_data)
    
    # Generar token de verificación
    verification_token = create_verification_token(email)
    
    # Nota: El envío de email se hace en la ruta (async)
    # Aquí solo retornamos el token para que la ruta lo envíe
    
    return {
        "user_id": user.id_usuario,
        "verification_token": verification_token,
        "email": email
    }


def login_user(db: Session, username: str, password: str):
    """
    Autentica un usuario y retorna tokens JWT
    
    Args:
        db: Sesión de base de datos
        username: Nombre de usuario
        password: Contraseña en texto plano
        
    Returns:
        Dict con tokens (access_token, refresh_token) o None si fallan las credenciales
    """
    from app.models.user_model import Usuario
    
    user = get_user_by_username(db, username)

    if not user:
        return None

    if not verify_password(password, user.password_hash):
        return None
    
    # Verificar que el email esté verificado
    if not user.verificado:
        return {"error": "Por favor verifica tu email antes de continuar"}

    return generate_token_pair(user.id_usuario)


def verify_user_email(db: Session, token: str):
    """
    Verifica el email de un usuario usando el token
    
    Args:
        db: Sesión de base de datos
        token: Token de verificación
        
    Returns:
        Dict con resultado de la verificación
    """
    from app.models.user_model import Usuario
    
    # Verificar el token
    email = verify_verification_token(token)
    
    if not email:
        return {"error": "Token inválido o expirado"}
    
    # Buscar el usuario por email
    user = db.query(Usuario).filter(
        Usuario.correo_electronico == email
    ).first()
    
    if not user:
        return {"error": "Usuario no encontrado"}
    
    # Actualizar estado de verificado
    if user.verificado:
        return {"message": "El email ya estaba verificado"}
    
    user.verificado = True
    db.commit()
    
    return {
        "message": "Email verificado exitosamente",
        "email": email,
        "user_id": user.id_usuario
    }