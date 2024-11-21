from pydantic import BaseModel
from datetime import datetime
from typing import List , Optional

class CommentBase(BaseModel):
    content: str
    tagged_users: Optional[List[int]] = None # list of user IDs

class CommentCreate(CommentBase):
    pass

class CommentRead(CommentBase):
    id: int
    user_id: int  # Add user_id field
    username: str
    task_id: int  # Add task_id field
    created_at: datetime  # Use datetime type
    tagged_users: Optional[list[int]] = None

    class Config:
        orm_mode = True
