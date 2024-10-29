from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.task_tag import TaskTag
from app.models.user import User
from app.models.task import Task
from app.schemas.tag import TagCreate  # Make sure this schema exists
from app.db.session import get_db
from app.api.dependencies import get_current_user

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

    return {"message": "User tagged successfully", "task_tag": task_tag}
