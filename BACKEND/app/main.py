from fastapi import FastAPI;
from app.api.v1.endpoints import router as api_router
from fastapi.middleware.cors import CORSMiddleware
from app.auth.oauth import router as oauth_router
from starlette.middleware.sessions import SessionMiddleware






app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this based on your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure the session middleware with a secret key
app.add_middleware(SessionMiddleware, secret_key="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")


app.include_router(api_router , prefix = "/api/v1")
app.include_router(oauth_router, prefix="/api/v1")