# app/core/config.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    AZURE_CLIENT_ID: str
    AZURE_CLIENT_SECRET: str
    AZURE_REDIRECT_URL: str
    AZURE_AUTHORITY: str
    AZURE_SCOPE: str
    AZURE_DISCOVERY_URL: str

    class Config:
        env_file = ".env"

settings = Settings()
