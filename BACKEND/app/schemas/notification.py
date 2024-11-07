# app/schemas/notification.py
from pydantic import BaseModel
from datetime import datetime

class NotificationBase(BaseModel):
    message: str
    is_read: bool = False

class NotificationCreate(NotificationBase):
    user_id: int

class Notification(NotificationBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True
