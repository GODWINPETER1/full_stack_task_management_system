# Define the pydantic schemas for user registration and a user login (validation)
from pydantic import BaseModel , EmailStr

# user registration schema
class UserCreate(BaseModel):
<<<<<<< HEAD
    name: str
=======
    username: str
>>>>>>> dee9bf867cfe32b89df46ab4cd68c64c3a7604d0
    email: EmailStr
    password: str

# user login schema
class UserLogin(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    
    class Config:
        from_attributes = True
        
