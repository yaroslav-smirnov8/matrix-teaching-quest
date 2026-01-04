from sqlalchemy import Column, Integer, String, DateTime, JSON, Float
from sqlalchemy.sql import func
from app.db.database import Base

class AnalyticsEvent(Base):
    """Модель для отслеживания событий пользователей"""
    __tablename__ = "analytics_events"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)  # LocalStorage user_id
    fingerprint = Column(String, index=True)  # Browser fingerprint
    session_id = Column(String, index=True, nullable=True)  # Session tracking
    event_type = Column(String, index=True)  # page_view, choice_made, quest_completed, etc.
    event_data = Column(JSON, default=dict)  # Additional event data
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Device info
    device_type = Column(String, nullable=True)
    browser = Column(String, nullable=True)
    os = Column(String, nullable=True)

class QuestStatistics(Base):
    """Агрегированная статистика по квесту"""
    __tablename__ = "quest_statistics"
    
    id = Column(Integer, primary_key=True, index=True)
    date = Column(DateTime(timezone=True), index=True)
    
    # User metrics
    total_users = Column(Integer, default=0)
    new_users = Column(Integer, default=0)
    active_users = Column(Integer, default=0)
    
    # Quest metrics
    quests_started = Column(Integer, default=0)
    quests_completed = Column(Integer, default=0)
    completion_rate = Column(Float, default=0.0)
    avg_completion_time = Column(Float, default=0.0)  # in seconds
    
    # Engagement metrics
    avg_playtime = Column(Float, default=0.0)
    total_choices_made = Column(Integer, default=0)
    
    # Promo codes
    promo_codes_generated = Column(Integer, default=0)
    promo_codes_used = Column(Integer, default=0)
    
    # Scene metrics (JSON with scene_id: count)
    scene_views = Column(JSON, default=dict)
    scene_dropoff = Column(JSON, default=dict)  # Where users stop
    
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
