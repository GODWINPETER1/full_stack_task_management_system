from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.models.roles import UserRole , RolePermission , Permission , Role
from app.models.user import User  # Import your user model
from app.db.session import get_db  # Import the database session
from app.core.config import settings  # Import your JWT settings
import logging

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")  # Ensure this matches your login route

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        # Decode the JWT
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        
        
        
        # Log for debugging (replace with proper logging in production)
        logging.debug(f"Payload: {payload}")  
        
        # Ensure that the payload is not None
        if payload is None:
            raise credentials_exception
        
        
        # Extract user_id (subject) from payload
        user_id: str = payload.get("sub")
        
        if not user_id or not isinstance(user_id, str):
            raise credentials_exception

        # Fetch the user from the database using the ID
        user = db.query(User).filter(User.id == int(user_id)).first()

        if user is None:
            raise credentials_exception

        return user

    except JWTError as e:
        logging.error(f"JWT Error: {e}")  # Replace print with logging
        raise credentials_exception
    

def has_permission(action: str):
    def permission_check(
        current_user: User = Depends(get_current_user), 
        db: Session = Depends(get_db)
    ):
        # Fetch the user's roles
        user_roles = db.query(Role).join(User.roles).filter(User.id == current_user.id).all()
        
        # Define role permissions (this could be moved to a config file or database)
        role_permissions = {
            "Admin": ["create_task", "view_task", "edit_task", "delete_task"],
            "Editor": ["create_task", "view_task", "edit_task"],
            "Viewer": ["view_task"]
        }

        # Check if the user has the required permission
        for role in user_roles:
            if action in role_permissions.get(role.name, []):
                return True
        
        # If no role matches the required permission, return 403 Forbidden
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail=f"Not authorized to perform action: {action}"
        )

    return permission_check