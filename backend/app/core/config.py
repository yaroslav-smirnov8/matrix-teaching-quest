import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:upp7ufary@localhost:5432/matrix_quest")
    ASYNC_DATABASE_URL: str = os.getenv("ASYNC_DATABASE_URL", "postgresql+asyncpg://postgres:upp7ufary@localhost:5432/matrix_quest")
    
    # Telegram
    TELEGRAM_BOT_TOKEN: str = os.getenv("TELEGRAM_BOT_TOKEN", "")
    TELEGRAM_WEBHOOK_URL: str = os.getenv("TELEGRAM_WEBHOOK_URL", "")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # Application
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://your-domain.com"
    ]
    
    # Course and Promo Settings
    COURSE_BASE_URL: str = os.getenv("COURSE_BASE_URL", "https://your-course-platform.com")
    MATRIX_DISCOUNT: int = int(os.getenv("MATRIX_DISCOUNT", "30"))

    # Admin
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "matrix2025"
    
    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
