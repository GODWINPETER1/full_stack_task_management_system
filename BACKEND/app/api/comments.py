from fastapi import APIRouter , Depends , HTTPException
from sqlalchemy.orm import Session
from app.models.Comment import Comment
from app.models.user import User
from app.models.task import Task
from typing import List
from app.schemas.comment import CommentCreate , CommentRead
from app.db.session import get_db
from app.api.dependencies import get_current_user


router = APIRouter()

@router.post("/tasks/{task_id}/comments", response_model=CommentRead)
async def create_comment(
    task_id: int, 
    comment: CommentCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # Check if the task exists
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Create the comment
    db_comment = Comment(content=comment.content, task_id=task_id, user_id=current_user.id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)  # Refresh the instance to get the new created_at value

    # Return the comment with user_id, task_id, and created_at
    return {
        "id": db_comment.id,
        "content": db_comment.content,
        "user_id": db_comment.user_id,  # Include user_id in the response
        "task_id": db_comment.task_id,  # Include task_id in the response
        "created_at": db_comment.created_at.isoformat()  # Convert to ISO string format
    }



@router.get("/tasks/{task_id}/comments", response_model=List[CommentRead])
def read_comments(task_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.task_id == task_id).all()

@router.delete("/comments/{comment_id}", response_model=CommentRead)
def delete_comment(comment_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    comment = db.query(Comment).filter(Comment.id == comment_id, Comment.user_id == current_user.id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    db.delete(comment)
    db.commit()
    return comment