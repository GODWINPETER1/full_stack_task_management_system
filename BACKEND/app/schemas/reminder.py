from pydantic import BaseModel
from datetime import datetime

class ReminderBase(BaseModel):
    task_id: int
    reminder_time: datetime

class ReminderCreate(ReminderBase):
    pass  # No additional fields needed for creation

class ReminderRead(ReminderBase):
    id: int

    class Config:
        orm_mode = True  # This allows Pydantic to read data from ORM models
