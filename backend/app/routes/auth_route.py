# routes/auth_route.py

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import threading
import time

from app.core.database import get_db

from app.schemas.user_schema import UsuarioLogin, UsuarioCreate, UsuarioResponse

from app.services.auth_service import login_user, register_user, verify_user_email
from app.core.mail import send_verification_email
from app.core.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


def send_email_in_thread(email: str, token: str):
    """
    Envía email en un thread separado (no bloquea)
    """
    try:
        print(f"[BACKGROUND] Iniciando envío de email a {email}")
        import requests
        import json
        
        # Usar requests en lugar de async (más simple)
        verification_link = f"http://localhost:3000/verify?token={token}"
        
        # Construir HTML del email
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; margin: 20px;">
                <h2>Verifica tu correo</h2>
                <p>Por favor, haz clic en el botón de abajo para verificar tu dirección de correo:</p>
                <a href="{verification_link}" 
                   style="background-color: #007bff; color: white; padding: 10px 20px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                    Verificar Correo
                </a>
                <p style="color: #666; font-size: 12px; margin-top: 20px;">
                    Este enlace expirará en 24 horas.
                </p>
            </body>
        </html>
        """
        
        # Enviar directamente con SMTP usando smtplib (no async)
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart
        
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Verifica tu correo - AlecTours"
        msg["From"] = settings.MAIL_FROM
        msg["To"] = email
        
        part = MIMEText(html_body, "html")
        msg.attach(part)
        
        # Conectar a Mailpit/SMTP con timeout
        with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT, timeout=5) as server:
            server.sendmail(settings.MAIL_FROM, email, msg.as_string())
        
        print(f"[BACKGROUND] Email enviado exitosamente a {email}")
        
    except Exception as e:
        print(f"[BACKGROUND] Error al enviar email a {email}: {str(e)}")


@router.post("/register", response_model=dict, status_code=201)
def register(data: UsuarioCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario en el sistema y envía email de verificación en background
    
    - **username**: Nombre de usuario (único, 3-50 caracteres)
    - **correo_electronico**: Email válido (único)
    - **password**: Contraseña (se hashea automáticamente)
    
    Envía un email de verificación al correo proporcionado (asincronamente).
    El usuario debe verificar su email antes de poder iniciar sesión.
    
    **Respuesta rápida (< 100ms)** - El email se envía en background
    """
    result = register_user(
        db,
        data.username,
        data.correo_electronico,
        data.password
    )
    
    if "error" in result:
        raise HTTPException(
            status_code=400,
            detail=result["error"]
        )
    
    # Enviar email en THREAD separado (no bloquea la respuesta)
    verification_token = result.get("verification_token")
    email = result.get("email")
    
    try:
        # Iniciar thread en background para enviar email
        thread = threading.Thread(
            target=send_email_in_thread,
            args=(email, verification_token),
            daemon=True  # Thread daemon muere cuando main thread muere
        )
        thread.start()
        print(f"[INFO] Thread de email iniciado para {email}")
    except Exception as e:
        print(f"[ERROR] No se pudo iniciar thread: {str(e)}")
        # No fallamos el registro si el email falla
    
    return {
        "message": "Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.",
        "user_id": result.get("user_id"),
        "email": email,
        "verification_token": verification_token
    }


@router.post("/login", response_model=dict)
def login(data: UsuarioLogin, db: Session = Depends(get_db)):
    """
    Inicia sesión con usuario y contraseña
    
    - **username**: Nombre de usuario registrado
    - **password**: Contraseña
    
    IMPORTANTE: El email debe estar verificado para poder iniciar sesión.
    
    Retorna tokens JWT: access_token y refresh_token
    """
    tokens = login_user(
        db,
        data.username,
        data.password
    )

    if not tokens:
        raise HTTPException(
            status_code=401,
            detail="Credenciales inválidas"
        )
    
    # Verificar si hay error (email no verificado)
    if isinstance(tokens, dict) and "error" in tokens:
        raise HTTPException(
            status_code=403,
            detail=tokens["error"]
        )

    return tokens


@router.post("/verify-email", response_model=dict)
def verify_email(token: str, db: Session = Depends(get_db)):
    """
    Verifica el email de un usuario usando el token recibido por correo
    
    - **token**: Token de verificación recibido por email
    
    Una vez verificado, el usuario puede iniciar sesión normalmente.
    """
    result = verify_user_email(db, token)
    
    if "error" in result:
        raise HTTPException(
            status_code=400,
            detail=result["error"]
        )
    
    return result