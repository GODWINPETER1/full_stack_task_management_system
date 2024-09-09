from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError , jwt
from sqlalchemy.orm import Session
from app.models.user import User  # Import your user model
from app.db.session import get_db  # Import the database session
from app.core.config import settings  # Import your JWT settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        print(f"Payload: {payload}")  # Log payload for debugging
        print(f"User ID type: {type(user_id)}")  # Log type of user_id
        if not isinstance(user_id, str):
            raise credentials_exception
        user = db.query(User).filter(User.id == int(user_id)).first()
        if user is None:
            raise credentials_exception
        return user
    except JWTError as e:
        print(f"JWTError: {e}")
        raise credentials_exception


