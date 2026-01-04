from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    id: int
    user_id: str
    fingerprint: Optional[str]
    device_type: Optional[str]
    browser: Optional[str]
    os: Optional[str]
    language_code: str
    created_at: datetime
    last_activity: datetime
    quest_completed: bool
    current_scene: str
    generated_promo_code: Optional[str]
    
    class Config:
        from_attributes = True

class UserListResponse(BaseModel):
    users: List[UserBase]
    total: int
    skip: int
    limit: int

class AnalyticsEventBase(BaseModel):
    id: int
    event_type: str
    event_data: Dict[str, Any]
    timestamp: datetime
    
    class Config:
        from_attributes = True

class UserDetailResponse(BaseModel):
    user: UserBase
    events: List[AnalyticsEventBase]
    total_events: int

class AnalyticsOverview(BaseModel):
    period_days: int
    total_users: int
    new_users: int
    active_users: int
    completed_quests: int
    completion_rate: float
    avg_completion_time: float
    promo_codes_generated: int
    promo_codes_used: int
    promo_usage_rate: float

class SceneAnalytics(BaseModel):
    scene_id: str
    users_reached: int
    percentage: float
    dropoff_rate: float

class TimelineEvent(BaseModel):
    timestamp: datetime
    event_type: str
    event_data: Dict[str, Any]

class UserJourneyResponse(BaseModel):
    user_id: int
    user_identifier: str
    fingerprint: Optional[str]
    started_at: Optional[datetime]
    completed: bool
    current_scene: str
    choices_made: Dict[str, Any]
    timeline: List[TimelineEvent]
    total_playtime: int
