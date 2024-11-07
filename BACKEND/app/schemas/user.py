# Define the pydantic schemas for user registration and a user login (validation)
from pydantic import BaseModel , EmailStr

# user registration schema
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str

# user login schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str
