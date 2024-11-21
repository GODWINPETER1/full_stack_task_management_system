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
    db_comment = Comment(content=comment.content, task_id=task_id, user_id=current_user.id, tagged_users=comment.tagged_users)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)  # Refresh the instance to get the new created_at value

    # Return the comment with user_id, task_id, created_at, and username
    return {
        "id": db_comment.id,
        "content": db_comment.content,
        "user_id": db_comment.user_id,
        "username": current_user.username,  # Include the username
        "task_id": db_comment.task_id,
        "created_at": db_comment.created_at,
        "tagged_users": db_comment.tagged_users,
    }




@router.get("/tasks/{task_id}/comments", response_model=List[CommentRead])
def read_comments(task_id: int, db: Session = Depends(get_db)):
    # Join Comment and User to include username in the response
    comments = (
        db.query(Comment, User.username)
        .join(User, Comment.user_id == User.id)
        .filter(Comment.task_id == task_id)
        .all()
    )

    # Format the response to include username
    return [
        {
            "id": comment.id,
            "content": comment.content,
            "user_id": comment.user_id,
            "username": username,  # Include username from the joined table
            "task_id": comment.task_id,
            "created_at": comment.created_at,
            "tagged_users": comment.tagged_users,
        }
        for comment, username in comments
    ]
