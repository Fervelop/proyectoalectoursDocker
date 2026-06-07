from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
import threading

from app.core.database import get_db
from app.schemas.user_schema import UsuarioLogin, UsuarioCreate, UsuarioResponse
from app.services.auth_service import login_user, register_user, verify_user_email
from app.core.config import settings

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


def send_email_in_thread(email: str, token: str):
    try:
        print(f"[BACKGROUND] Iniciando envío de email a {email}")
        
        import smtplib
        from email.mime.text import MIMEText
        from email.mime.multipart import MIMEMultipart

        verification_link = f"http://localhost:5173/verify?token={token}"

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

        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Verifica tu correo - AlecTours"
        msg["From"] = settings.MAIL_FROM
        msg["To"] = email

        part = MIMEText(html_body, "html")
        msg.attach(part)

        with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT, timeout=5) as server:
            server.sendmail(settings.MAIL_FROM, email, msg.as_string())

        print(f"[BACKGROUND] Email enviado exitosamente a {email}")

    except Exception as e:
        print(f"[BACKGROUND] Error al enviar email a {email}: {str(e)}")


@router.post("/register", response_model=dict, status_code=201)
def register(data: UsuarioCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    result = register_user(db, data.username, data.correo_electronico, data.password)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    verification_token = result.get("verification_token")
    email = result.get("email")

    try:
        thread = threading.Thread(
            target=send_email_in_thread,
            args=(email, verification_token),
            daemon=True
        )
        thread.start()
        print(f"[INFO] Thread de email iniciado para {email}")
    except Exception as e:
        print(f"[ERROR] No se pudo iniciar thread: {str(e)}")

    return {
        "message": "Usuario registrado exitosamente. Revisa tu correo para verificar tu cuenta.",
        "user_id": result.get("user_id"),
        "email": email,
        "verification_token": verification_token
    }


@router.post("/login", response_model=dict)
def login(data: UsuarioLogin, db: Session = Depends(get_db)):
    tokens = login_user(db, data.username, data.password)

    if not tokens:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    if isinstance(tokens, dict) and "error" in tokens:
        raise HTTPException(status_code=403, detail=tokens["error"])

    return tokens


@router.post("/verify-email", response_model=dict)
def verify_email(token: str, db: Session = Depends(get_db)):
    result = verify_user_email(db, token)

    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])

    return result