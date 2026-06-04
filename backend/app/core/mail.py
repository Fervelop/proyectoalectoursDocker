"""
Módulo de correo electrónico: configuración y envío de emails con FastAPI-Mail.
"""

from typing import List, Optional

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Template

from app.core.config import settings

# Configuración de conexión SMTP
conf = ConnectionConfig(
    mail_username=settings.MAIL_USERNAME,
    mail_password=settings.MAIL_PASSWORD,
    mail_from=settings.MAIL_FROM,
    mail_port=settings.MAIL_PORT,
    mail_server=settings.MAIL_SERVER,
    mail_starttls=settings.MAIL_STARTTLS,
    mail_ssl_tls=settings.MAIL_SSL_TLS,
    use_credentials=True,
    validate_certs=True,
)

# Cliente FastMail
fast_mail = FastMail(conf)


async def send_email(
    email: str,
    subject: str,
    body: str,
    html_body: Optional[str] = None
) -> bool:
    """
    Envía un email simple o con cuerpo HTML.
    
    Args:
        email: Dirección de correo destino
        subject: Asunto del email
        body: Cuerpo en texto plano
        html_body: Cuerpo en HTML (opcional)
        
    Returns:
        True si se envió correctamente, False en caso contrario
    """
    try:
        message = MessageSchema(
            subject=subject,
            recipients=[email],
            body=body,
            html=html_body,
            subtype="html" if html_body else "plain"
        )
        
        await fast_mail.send_message(message)
        return True
    except Exception as e:
        print(f"Error al enviar email a {email}: {str(e)}")
        return False


async def send_welcome_email(email: str, name: str) -> bool:
    """
    Envía un email de bienvenida a un nuevo usuario.
    
    Args:
        email: Dirección de correo destino
        name: Nombre del usuario
        
    Returns:
        True si se envió correctamente
    """
    subject = "Bienvenido a AlecTours"
    
    body = f"""
    Hola {name},
    
    ¡Bienvenido a AlecTours! Tu cuenta ha sido creada exitosamente.
    
    Ya puedes acceder a nuestra plataforma con tus credenciales.
    
    Saludos,
    El equipo de AlecTours
    """
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; margin: 20px;">
            <h2>¡Bienvenido a AlecTours! 🎉</h2>
            <p>Hola <strong>{name}</strong>,</p>
            <p>Tu cuenta ha sido creada exitosamente.</p>
            <p>Ya puedes acceder a nuestra plataforma con tus credenciales.</p>
            <hr>
            <p>Saludos,<br>El equipo de AlecTours</p>
        </body>
    </html>
    """
    
    return await send_email(email, subject, body, html_body)


async def send_verification_email(
    email: str,
    verification_token: str,
    base_url: str = "http://localhost:3000"
) -> bool:
    """
    Envía un email de verificación con un enlace.
    
    Args:
        email: Dirección de correo destino
        verification_token: Token de verificación
        base_url: URL base de la aplicación
        
    Returns:
        True si se envió correctamente
    """
    verification_link = f"{base_url}/verify?token={verification_token}"
    
    subject = "Verifica tu correo - AlecTours"
    
    body = f"""
    Hola,
    
    Por favor verifica tu correo haciendo clic en el siguiente enlace:
    {verification_link}
    
    Este enlace expirará en 24 horas.
    
    Saludos,
    El equipo de AlecTours
    """
    
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
            <hr>
            <p>Saludos,<br>El equipo de AlecTours</p>
        </body>
    </html>
    """
    
    return await send_email(email, subject, body, html_body)


async def send_password_reset_email(
    email: str,
    reset_token: str,
    base_url: str = "http://localhost:3000"
) -> bool:
    """
    Envía un email para reseteo de contraseña.
    
    Args:
        email: Dirección de correo destino
        reset_token: Token para resetear contraseña
        base_url: URL base de la aplicación
        
    Returns:
        True si se envió correctamente
    """
    reset_link = f"{base_url}/reset-password?token={reset_token}"
    
    subject = "Restablecer contraseña - AlecTours"
    
    body = f"""
    Hola,
    
    Recibimos una solicitud para restablecer tu contraseña.
    
    Haz clic en el siguiente enlace para crear una nueva contraseña:
    {reset_link}
    
    Si no solicitaste esto, ignora este correo.
    Este enlace expirará en 1 hora.
    
    Saludos,
    El equipo de AlecTours
    """
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; margin: 20px;">
            <h2>Restablecer contraseña</h2>
            <p>Recibimos una solicitud para restablecer tu contraseña.</p>
            <p>Haz clic en el botón de abajo para crear una nueva:</p>
            <a href="{reset_link}"
               style="background-color: #28a745; color: white; padding: 10px 20px;
                      text-decoration: none; border-radius: 5px; display: inline-block;">
                Restablecer Contraseña
            </a>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
                Si no solicitaste esto, ignora este correo.
                Este enlace expirará en 1 hora.
            </p>
            <hr>
            <p>Saludos,<br>El equipo de AlecTours</p>
        </body>
    </html>
    """
    
    return await send_email(email, subject, body, html_body)


async def send_reservation_confirmation(
    email: str,
    reservation_id: int,
    hotel_name: str,
    check_in: str,
    check_out: str,
    total_price: float,
    guest_name: str
) -> bool:
    """
    Envía confirmación de reserva.
    
    Args:
        email: Dirección de correo destino
        reservation_id: ID de la reserva
        hotel_name: Nombre del hotel
        check_in: Fecha de entrada
        check_out: Fecha de salida
        total_price: Precio total
        guest_name: Nombre del huésped
        
    Returns:
        True si se envió correctamente
    """
    subject = f"Confirmación de Reserva #{reservation_id} - AlecTours"
    
    body = f"""
    Hola {guest_name},
    
    Tu reserva ha sido confirmada.
    
    Detalles:
    - Reserva ID: {reservation_id}
    - Hotel: {hotel_name}
    - Check-in: {check_in}
    - Check-out: {check_out}
    - Total: ${total_price:.2f}
    
    Gracias por elegir AlecTours.
    
    Saludos,
    El equipo de AlecTours
    """
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
            <h2>Confirmación de Reserva 🎉</h2>
            <p>Hola <strong>{guest_name}</strong>,</p>
            <p>Tu reserva ha sido confirmada exitosamente.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #007bff;">Detalles de tu Reserva</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Número de Reserva:</td>
                        <td style="padding: 8px;">{reservation_id}</td>
                    </tr>
                    <tr style="background-color: #fff;">
                        <td style="padding: 8px; font-weight: bold;">Hotel:</td>
                        <td style="padding: 8px;">{hotel_name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Check-in:</td>
                        <td style="padding: 8px;">{check_in}</td>
                    </tr>
                    <tr style="background-color: #fff;">
                        <td style="padding: 8px; font-weight: bold;">Check-out:</td>
                        <td style="padding: 8px;">{check_out}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; font-weight: bold;">Total:</td>
                        <td style="padding: 8px; color: #28a745; font-weight: bold;">${total_price:.2f}</td>
                    </tr>
                </table>
            </div>
            
            <p>Gracias por elegir AlecTours para tu próxima aventura.</p>
            <hr>
            <p>Saludos,<br>El equipo de AlecTours</p>
        </body>
    </html>
    """
    
    return await send_email(email, subject, body, html_body)


async def send_cancellation_email(
    email: str,
    reservation_id: int,
    guest_name: str,
    refund_amount: Optional[float] = None
) -> bool:
    """
    Envía confirmación de cancelación de reserva.
    
    Args:
        email: Dirección de correo destino
        reservation_id: ID de la reserva
        guest_name: Nombre del huésped
        refund_amount: Monto a reembolsar (opcional)
        
    Returns:
        True si se envió correctamente
    """
    subject = f"Cancelación de Reserva #{reservation_id} - AlecTours"
    
    refund_text = f"Reembolso: ${refund_amount:.2f}" if refund_amount else ""
    
    body = f"""
    Hola {guest_name},
    
    Tu reserva #{reservation_id} ha sido cancelada.
    
    {refund_text}
    
    Si tienes dudas, contacta a nuestro equipo.
    
    Saludos,
    El equipo de AlecTours
    """
    
    html_body = f"""
    <html>
        <body style="font-family: Arial, sans-serif; margin: 20px; color: #333;">
            <h2>Cancelación de Reserva</h2>
            <p>Hola <strong>{guest_name}</strong>,</p>
            <p>Tu reserva <strong>#{reservation_id}</strong> ha sido cancelada.</p>
            {f'<p style="color: #28a745;">Reembolso: <strong>${refund_amount:.2f}</strong></p>' if refund_amount else ''}
            <p>Si tienes dudas, no dudes en contactarnos.</p>
            <hr>
            <p>Saludos,<br>El equipo de AlecTours</p>
        </body>
    </html>
    """
    
    return await send_email(email, subject, body, html_body)
