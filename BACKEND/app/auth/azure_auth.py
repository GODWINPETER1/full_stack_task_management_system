# app/auth/azure_auth.py

from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from app.core.config import settings  # Corrected import

oauth = OAuth()
oauth.register(
    name="microsoft",
    client_id=settings.AZURE_CLIENT_ID,  # Use `settings` instead of `Settings`
    client_secret=settings.AZURE_CLIENT_SECRET,  # Use `settings` instead of `Settings`
    authorize_url=f"{settings.AZURE_AUTHORITY}/oauth2/v2.0/authorize",  # Use `settings`
    access_token_url=f"{settings.AZURE_AUTHORITY}/oauth2/v2.0/token",  # Use `settings`
    client_kwargs={"scope": settings.AZURE_SCOPE},  # Use `settings`
)

azure_router = APIRouter()

@azure_router.get("/auth/microsoft")
async def microsoft_login(request: Request):
    redirect_uri = settings.AZURE_REDIRECT_URL  # Use `settings`
    return await oauth.microsoft.authorize_redirect(request, redirect_uri)

@azure_router.get("/auth/microsoft/callback")
async def microsoft_callback(request: Request):
    try:
        token = await oauth.microsoft.authorize_access_token(request)
        user_info = await oauth.microsoft.parse_id_token(request, token)
        return {"token": token, "user_info": user_info}
    except Exception as e:
        return {"error": str(e)}
