from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON
from sqlalchemy.sql import func
from app.db.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True, nullable=False)  # LocalStorage ID
    fingerprint = Column(String, index=True, nullable=True)  # Browser fingerprint
    session_id = Column(String, nullable=True)  # Current session
    
    # Device info
    device_type = Column(String, nullable=True)  # mobile/tablet/desktop
    browser = Column(String, nullable=True)
    os = Column(String, nullable=True)
    screen_resolution = Column(String, nullable=True)
    language_code = Column(String, default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Quest progress
    current_scene = Column(String, default="loading")
    quest_completed = Column(Boolean, default=False)
    completion_time = Column(Integer, nullable=True)  # in seconds
    choices_made = Column(JSON, default=dict)  # Store all choices as JSON
    
    # Achievements
    achievements = Column(JSON, default=list)  # List of achievement IDs
    white_rabbits_found = Column(Integer, default=0)
    easter_eggs_found = Column(JSON, default=list)
    
    # Promo codes
    generated_promo_code = Column(String, nullable=True)
    promo_code_used = Column(Boolean, default=False)
    
    # Analytics
    start_time = Column(DateTime(timezone=True), nullable=True)
    last_activity = Column(DateTime(timezone=True), server_default=func.now())
    total_playtime = Column(Integer, default=0)  # in seconds
