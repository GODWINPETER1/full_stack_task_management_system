# app/api/v1/time_tracking.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.models.time_log import TimeLog
from app.models.task import Task
from app.models.user import User
from app.db.session import get_db
from app.api.dependencies import get_current_user

router = APIRouter()

# Start the timer for a task
@router.post("/tasks/{task_id}/start_timer")
def start_timer(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check for an already running timer
    active_timer = db.query(TimeLog).filter(
        TimeLog.task_id == task_id, 
        TimeLog.user_id == current_user.id,
        TimeLog.end_time == None
    ).first()
    if active_timer:
        raise HTTPException(status_code=400, detail="Timer is already running for this task")

    time_log = TimeLog(task_id=task_id, user_id=current_user.id, start_time=datetime.utcnow())
    db.add(time_log)
    db.commit()
    db.refresh(time_log)
    return {"message": "Timer started", "time_log": time_log}

# Stop the timer for a task
@router.post("/tasks/{task_id}/stop_timer")
def stop_timer(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    time_log = db.query(TimeLog).filter(
        TimeLog.task_id == task_id, 
        TimeLog.user_id == current_user.id,
        TimeLog.end_time == None
    ).first()
    if not time_log:
        raise HTTPException(status_code=404, detail="Active timer not found for this task")

    time_log.end_time = datetime.utcnow()
    time_log.duration = int((time_log.end_time - time_log.start_time).total_seconds())
    db.commit()
    db.refresh(time_log)
    return {"message": "Timer stopped successfully", "duration": time_log.duration}

# Pause the timer for a task
@router.post("/tasks/{task_id}/pause_timer")
def pause_timer(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    time_log = db.query(TimeLog).filter(
        TimeLog.task_id == task_id, 
        TimeLog.user_id == current_user.id,
        TimeLog.end_time == None
    ).first()
    if not time_log:
        raise HTTPException(status_code=404, detail="No active timer found to pause")

    # Stop the timer temporarily
    time_log.end_time = datetime.utcnow()
    time_log.duration = int((time_log.end_time - time_log.start_time).total_seconds())
    db.commit()
    db.refresh(time_log)
    return {"message": "Timer paused successfully", "duration": time_log.duration}

# Resume the timer for a task
@router.post("/tasks/{task_id}/resume_timer")
def resume_timer(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    paused_time_log = db.query(TimeLog).filter(
        TimeLog.task_id == task_id, 
        TimeLog.user_id == current_user.id,
        TimeLog.end_time != None
    ).order_by(TimeLog.end_time.desc()).first()

    if not paused_time_log or (paused_time_log and paused_time_log.start_time is None):
        raise HTTPException(status_code=404, detail="No paused timer found to resume")

    # Create a new log entry to resume the timer
    time_log = TimeLog(task_id=task_id, user_id=current_user.id, start_time=datetime.utcnow())
    db.add(time_log)
    db.commit()
    db.refresh(time_log)
    return {"message": "Timer resumed", "time_log": time_log}

# Get total time spent on a task
@router.get("/tasks/{task_id}/total_time")
def get_total_time(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    time_logs = db.query(TimeLog).filter(TimeLog.task_id == task_id, TimeLog.user_id == current_user.id).all()
    total_duration = sum([log.duration or 0 for log in time_logs])
    return {"total_time_seconds": total_duration, "total_time_hours": total_duration / 3600}

# Get all time logs for a task
@router.get("/tasks/{task_id}/time_logs")
def get_time_logs(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    time_logs = db.query(TimeLog).filter(TimeLog.task_id == task_id, TimeLog.user_id == current_user.id).all()
    return time_logs
