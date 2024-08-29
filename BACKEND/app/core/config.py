# configuring data connection
from pydantic_settings import BaseSettings;

# sample_database_url ="postgresql://user:password@localhost/dbname"

class Settings(BaseSettings):
    DATABASE_URL: str = 'postgresql://postgres:Moshi1996@localhost/fastapi'
    
settings = Settings()