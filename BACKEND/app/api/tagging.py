from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.task_tag import TaskTag
from app.models.user import User
from app.models.task import Task
from app.schemas.tag import TagCreate  # Make sure this schema exists
from app.db.session import get_db
from app.api.dependencies import get_current_user
from app.utils import create_notification

router = APIRouter()

@router.post("/tasks/{task_id}/tag")
async def tag_user_to_task(task_id: int, tag: TagCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check if the task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Check if the user exists
    user = db.query(User).filter(User.id == tag.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create the tag
    task_tag = TaskTag(task_id=task_id, user_id=tag.user_id)
    db.add(task_tag)
    db.commit()
    db.refresh(task_tag)
    
    message = f"You have been tagged to a task with id {task_id}"
    create_notification(db , user_id= tag.user_id, message=message)

    return {"message": "User tagged successfully", "task_tag": task_tag}



@router.delete("/tasks/{task_id}/tag/{user_id}")
async def delete_tag(task_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify that the task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Verify that the user tag exists for this task
    tag = db.query(TaskTag).filter(TaskTag.task_id == task_id, TaskTag.user_id == user_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Tag not found for the specified task and user")

    # Perform deletion
    db.delete(tag)
    db.commit()
    return {"message": "User tag removed successfully"}

