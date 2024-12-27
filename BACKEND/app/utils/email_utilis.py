from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from app.core.config import settings

async def send_invitation_email(recipient_email: str, subject: str, body: str, from_email: str):
    # Create dynamic configuration for the current sender
    conf = ConnectionConfig(
        MAIL_USERNAME=from_email,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,  # You may want to store and retrieve individual passwords for each user
        MAIL_FROM=from_email,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
    )
    
    # Create and send the message
    message = MessageSchema(
        subject=subject,
        recipients=[recipient_email],
        body=body,
        subtype="html",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
