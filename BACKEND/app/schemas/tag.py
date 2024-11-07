from pydantic import BaseModel

class TagCreate(BaseModel):
    user_id: int  # Ensure this matches the expected data type
