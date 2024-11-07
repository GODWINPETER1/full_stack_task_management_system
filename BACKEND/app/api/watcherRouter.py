from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.task import Task
from app.models.taskWatcher import TaskWatcher
from app.schemas.user import UserOut
from app.schemas.user import UserCreate
from app.models.user import User
from app.schemas.message import Message
from typing import List
from app.db.session import get_db
from app.api.dependencies import get_current_user

router = APIRouter()

@router.post("/tasks/{task_id}/watch", response_model=Message)
def watch_task(task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Check if the task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Check if the user is already watching the task
    existing_watcher = db.query(TaskWatcher).filter_by(user_id=user.id, task_id=task_id).first()
    if existing_watcher:
        raise HTTPException(status_code=400, detail="You are already watching this task")

    # Add user as a watcher
    new_watcher = TaskWatcher(task_id=task_id, user_id=user.id)
    db.add(new_watcher)
    db.commit()
    return {"message": "You are now watching this task."}

@router.delete("/tasks/{task_id}/watch", response_model=Message)
def unwatch_task(task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    # Check if the task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        print("Task not found")  # Debugging log
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Check if the user is watching this task
    watcher = db.query(TaskWatcher).filter_by(user_id=user.id, task_id=task_id).first()
    if not watcher:
        print("User is not watching this task")  # Debugging log
        raise HTTPException(status_code=400, detail="You are not watching this task")
    
    # Remove watcher and commit the transaction
    db.delete(watcher)
    db.commit()
    print("User has stopped watching the task")  # Debugging log
    
    return {"detail": "You have stopped watching this task."}


@router.get("/tasks/{task_id}/watchers", response_model=List[UserOut])
def get_task_watchers(task_id: int, db: Session = Depends(get_db)):
    # Get all users watching the task
    watchers = db.query(TaskWatcher).filter_by(task_id=task_id).all()
    return [watcher.user for watcher in watchers]

@router.get("/tasks/{task_id}/is_watching", response_model=dict)
def is_watching_task(task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    watcher = db.query(TaskWatcher).filter_by(user_id=user.id, task_id=task_id).first()
    return {"is_watching": watcher is not None}

