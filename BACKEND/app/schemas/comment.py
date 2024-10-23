from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    pass

class CommentRead(CommentBase):
    id: int
    user_id: int  # Add user_id field
    task_id: int  # Add task_id field
    created_at: datetime  # Use datetime type

    class Config:
        orm_mode = True
