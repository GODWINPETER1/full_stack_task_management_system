# app/api/v1/endpoints.py

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate , UserLogin
from app.models.user import User
from app.core.security import get_password_hash
from app.db.session import get_db

router = APIRouter()

@router.post("/register")
async def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_password = get_password_hash(user_in.password)
    new_user = User(name=user_in.name, email=user_in.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


# user login
@router.post("/login")
async def login_user(user_in: UserLogin , db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not get_password_hash(user_in.password):
        
        raise HTTPException(status_code=400, detail="Invalid credentials")
    
    return {"user" : "user successfully login"};
