from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin
from app.models.user import User
from app.core.security import get_password_hash, verify_password  # Added verify_password
from app.db.session import get_db
from jose import JWTError , jwt
from app.core.config import settings 
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta



router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password: str

# Initialize the password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=1)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


# user registration 
@router.post("/register")
async def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    # Check if the email is already registered
    email_exists = db.query(User).filter(User.email == user_in.email).first()
    if email_exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # Check if the username is already taken
    username_exists = db.query(User).filter(User.username == user_in.username).first()
    if username_exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")
    
    # Hash the password and create a new user
    hashed_password = get_password_hash(user_in.password)
    new_user = User(username=user_in.username, email=user_in.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login")
async def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Create a token payload
    access_token = create_access_token(data={"sub": user.id})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email
    }
