# configuring data connection
from pydantic_settings import BaseSettings;


# sample_database_url ="postgresql://user:password@localhost/dbname"

class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    DATABASE_URL: str
    GOOGLE_CLIENT_ID: str  # Add this line
    GOOGLE_CLIENT_SECRET: str  # Add this line
    
  
    class Config:
        env_file = ".env"
settings = Settings()