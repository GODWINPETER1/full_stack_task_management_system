from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.user import User

router = APIRouter()

@router.get("/users/search")
def search_users(query: str, db: Session = Depends(get_db)):
    users = db.query(User).filter(User.username.ilike(f"%{query}%")).all()
    if not users:
        return []
    return [{"id": user.id, "username": user.username, "email": user.email} for user in users]
