# app/auth/azure_auth.py

from fastapi import APIRouter, Request, Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from app.core.config import settings  # Corrected import
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.models.user import User
import httpx  # Change from requests to httpx for async support
from app.db.session import get_db

oauth = OAuth()
oauth.register(
    name="microsoft",
    client_id=settings.AZURE_CLIENT_ID,
    client_secret=settings.AZURE_CLIENT_SECRET,
    authorize_url=f"{settings.AZURE_AUTHORITY}/oauth2/v2.0/authorize",
    access_token_url=f"{settings.AZURE_AUTHORITY}/oauth2/v2.0/token",
    redirect_uri=settings.AZURE_REDIRECT_URL,
    client_kwargs={
        "scope": "openid profile email",
        "response_type": "code",
        "response_mode": "query",
    },
)


azure_router = APIRouter()

@azure_router.get("/auth/microsoft")
async def microsoft_login(request: Request):
    redirect_uri = settings.AZURE_REDIRECT_URL  # Use `settings`
    return await oauth.microsoft.authorize_redirect(request, redirect_uri)

@azure_router.get("/auth/microsoft/callback")
async def microsoft_callback(request: Request, db: Session = Depends(get_db)):
    try:
        token = await oauth.microsoft.authorize_access_token(request)
        user_info = await oauth.microsoft.parse_id_token(request, token)
        email = user_info.get("email")

        # Check if the user exists
        user = db.query(User).filter(User.email == email).first()
        if not user:
            user = User(email=email, username=user_info.get("name"))
            db.add(user)
            db.commit()

        # Redirect to the frontend
        return RedirectResponse(url="/dashboard/overview")
    except Exception as e:
        return {"error": str(e)}

