from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.schemas.user import UserCreate, UserLogin
from app.models.user import User
from app.core.security import get_password_hash, verify_password  # Added verify_password
from app.db.session import get_db
from app.models.roles import Role , UserRole
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
    
    # JWT now includes role
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)  # Refresh token valid for 7 days
    to_encode.update({"exp": expire})
    encoded_refresh_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_refresh_jwt



@router.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
        
        # Issue a new access token
        access_token = create_access_token(data={"sub": str(user.id)})
        return {"access_token": access_token}
    
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")


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

    # Assign a role based on email domain
    if "@admin.com" in user_in.email:
        default_role = db.query(Role).filter(Role.name == "Admin").first()
    elif "@editor.com" in user_in.email:
        default_role = db.query(Role).filter(Role.name == "Editor").first()
    else:
        default_role = db.query(Role).filter(Role.name == "Viewer").first()

    if not default_role:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Role not found")

    # Assign the role to the new user
    user_role = UserRole(user_id=new_user.id, role_id=default_role.id)
    db.add(user_role)
    db.commit()

    return new_user



@router.post("/login")
async def login_user(user_in: UserLogin, db: Session = Depends(get_db)):
    # Fetch the user from the database by email
    user = db.query(User).filter(User.email == user_in.email).first()

    if not user or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    # Fetch the user's role
    user_role = db.query(Role).join(UserRole).filter(UserRole.user_id == user.id).first()

    if not user_role:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User has no role assigned")

    # Create a token payload including the user's role
    access_token = create_access_token(data={"sub": str(user.id), "role": user_role.name})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "username": user.username,
        "email": user.email,
        "id": user.id,
        "role": user_role.name  # Add role to the response
    }

