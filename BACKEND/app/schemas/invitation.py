from pydantic import BaseModel, EmailStr
from datetime import datetime

from pydantic import validator

class InvitationBase(BaseModel):
    email: EmailStr
    role: str = "Viewer"  # Default role

    @validator('role')
    def validate_role(cls, v):
        valid_roles = ['Admin', 'Editor', 'Viewer']
        if v not in valid_roles:
            raise ValueError(f"Invalid role '{v}', must be one of {valid_roles}")
        return v


class InvitationCreate(InvitationBase):
    project_id: int | None = None

class InvitationRead(InvitationBase):
    id: int
    token: str
    accepted: bool
    expiry_date: datetime

    class Config:
        orm_mode = True
