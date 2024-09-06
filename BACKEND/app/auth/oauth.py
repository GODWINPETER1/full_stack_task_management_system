from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends
from starlette.config import Config
from starlette.requests import Request
from starlette.responses import RedirectResponse
from sqlalchemy.orm import Session
from app import models
from app.db.session import get_db

config = Config(".env")
oauth = OAuth(config)

# Register the Google OAuth
oauth.register(
    name='google',
    client_id='1004784113481-4qjar2oob7k3t6e7cfbjfs08mhteaj67.apps.googleusercontent.com',
    client_secret='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',
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    redirect_uri='http://127.0.0.1:8000/api/v1/auth/google/callbacks',
    client_kwargs={
        'scope': 'openid profile email',
        'code_challenge_method': 'S256',
    },
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
)

router = APIRouter()

@router.get("/auth/google")
async def google_login(request: Request):
    redirect_uri = request.url_for("google_auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/auth/google/callback")
async def google_auth_callback(request: Request, db: Session = Depends(get_db)):
    token = await oauth.google.authorize_access_token(request)
    user_info = await oauth.google.parse_id_token(request, token)
    email = user_info.get("email")
    
    # Check if the user exists in the database
    user = db.query(models.User).filter(models.User.email == email).first()
    
    if not user:
        # Create a new user if they don't exist
        user = models.User(email=email, username=user_info.get("name"))
        db.add(user)
        db.commit()
    
    # Redirect the user to the frontend after login
    return RedirectResponse(url='/dashboard')
