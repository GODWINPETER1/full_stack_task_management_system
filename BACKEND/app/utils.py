# app/utils.py
from sqlalchemy.orm import Session
from app.models.notification import Notification
from datetime import datetime

def create_notification(db: Session, user_id: int, message: str):
    notification = Notification(
        user_id=user_id,
        message=message,
        is_read=False,
        created_at=datetime.utcnow()
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
