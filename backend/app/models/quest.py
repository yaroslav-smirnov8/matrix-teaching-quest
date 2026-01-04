from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base

class QuestScene(Base):
    __tablename__ = "quest_scenes"
    
    id = Column(String, primary_key=True)  # e.g., "loading", "scene1", "scene2a"
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    scene_type = Column(String, nullable=False)  # "story", "choice", "challenge"
    content = Column(JSON, nullable=False)  # Scene content and options
    next_scenes = Column(JSON, default=list)  # Possible next scenes
    requirements = Column(JSON, default=dict)  # Requirements to access this scene
    
class QuestProgress(Base):
    __tablename__ = "quest_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scene_id = Column(String, ForeignKey("quest_scenes.id"), nullable=False)
    visited_at = Column(DateTime(timezone=True), server_default=func.now())
    choice_made = Column(String, nullable=True)  # Choice ID if applicable
    time_spent = Column(Integer, default=0)  # seconds spent on this scene
    
class Choice(Base):
    __tablename__ = "choices"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scene_id = Column(String, nullable=False)
    choice_id = Column(String, nullable=False)  # e.g., "red_pill", "blue_pill"
    choice_text = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(String, primary_key=True)  # e.g., "glitch_hunter", "speed_runner"
    name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String, nullable=True)  # emoji or icon class
    requirements = Column(JSON, nullable=False)  # Achievement requirements
    reward_type = Column(String, nullable=True)  # "promo_code", "badge", etc.
    reward_value = Column(String, nullable=True)  # actual reward
    
class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(String, ForeignKey("achievements.id"), nullable=False)
    earned_at = Column(DateTime(timezone=True), server_default=func.now())
    
class PromoCode(Base):
    __tablename__ = "promo_codes"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    discount_type = Column(String, nullable=False)  # "REDPILL", "MORPHEUS", etc.
    discount_value = Column(Integer, nullable=False)  # percentage
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    used_at = Column(DateTime(timezone=True), nullable=True)
    is_active = Column(Boolean, default=True)
