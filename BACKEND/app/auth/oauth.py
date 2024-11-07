from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, HTTPException
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
from app.models.user import User
import httpx  # Change from requests to httpx for async support
from app.db.session import get_db

config = Config(".env")
oauth = OAuth(config)

# Register the Google OAuth
oauth.register(
    name='google',
    client_id= "1004784113481-4qjar2oob7k3t6e7cfbjfs08mhteaj67.apps.googleusercontent.com",
    client_secret= "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",
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    redirect_uri='http://127.0.0.1:8000/api/v1/auth/google/callback',
    client_kwargs={
        'scope': 'openid profile email',
        'access_type': 'offline',
        'prompt': 'consent',
        'code_challenge_method': 'S256',
    },
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
)

router = APIRouter()

@router.post("/auth/google/login")
async def google_login_token(request: Request, db: Session = Depends(get_db)):
    body = await request.json()
    token = body.get("token")

    if not token:
        raise HTTPException(status_code=400, detail="Token missing")

    # Verify the token with Google
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Invalid token")

    user_info = response.json()
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")

    # Check if the user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, username=name)
        db.add(user)
        db.commit()

    return {"message": "User authenticated", "user": email, "picture": picture, "name": name}

@router.get("/auth/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def google_auth_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.parse_id_token(request, token)
    email = user_info.get("email")

    # Check if the user exists
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(email=email, username=user_info.get("name"))
        db.add(user)
        db.commit()

    # Redirect to the frontend after login
    return RedirectResponse(url='/dashboard/overview')
