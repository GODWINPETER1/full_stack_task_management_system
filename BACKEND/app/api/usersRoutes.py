# Import necessary modules
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User  # Assuming this is the user model in your app
from app.schemas.user import UserOut  # Define a Pydantic schema for the response

# Initialize the router for the users endpoint
router = APIRouter()

# Define an API route to fetch all users from the database
@router.get("/users/", response_model=List[UserOut])
def get_users(db: Session = Depends(get_db)):
    try:
        # Query to get all users from the database
        users = db.query(User).all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
