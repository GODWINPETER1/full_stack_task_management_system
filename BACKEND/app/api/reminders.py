from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.reminder import Reminder
from app.schemas.reminder import ReminderCreate, ReminderRead  # Create these schemas

router = APIRouter()

@router.post("/", response_model=ReminderRead)
def create_reminder(reminder: ReminderCreate, db: Session = Depends(get_db)):
    db_reminder = Reminder(**reminder.dict())
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

@router.get("/{task_id}", response_model=list[ReminderRead])
def get_reminders(task_id: int, db: Session = Depends(get_db)):
    return db.query(Reminder).filter(Reminder.task_id == task_id).all()
