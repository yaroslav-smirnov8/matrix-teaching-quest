from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class QuestStartRequest(BaseModel):
    telegram_id: str
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    language_code: str = "en"

class QuestStartResponse(BaseModel):
    user_id: int
    scene_id: str
    scene_content: Dict[str, Any]
    message: str

class ChoiceRequest(BaseModel):
    telegram_id: str
    scene_id: str
    choice_id: str
    choice_text: str

class ChoiceResponse(BaseModel):
    next_scene_id: str
    scene_content: Dict[str, Any]
    achievements_earned: List[str] = []
    promo_code: Optional[str] = None

class UserProgressResponse(BaseModel):
    current_scene: str
    quest_completed: bool
    completion_time: Optional[int]
    achievements: List[str]
    white_rabbits_found: int
    easter_eggs_found: List[str]
    generated_promo_code: Optional[str]
    total_playtime: int

class AchievementResponse(BaseModel):
    id: str
    name: str
    description: str
    icon: Optional[str]
    earned_at: Optional[datetime]

class PromoCodeResponse(BaseModel):
    code: str
    discount_type: str
    discount_value: int
    course_url: str
    expires_at: Optional[datetime]

class LeaderboardEntry(BaseModel):
    username: str
    completion_time: int
    achievements_count: int
    rank: int

class LeaderboardResponse(BaseModel):
    entries: List[LeaderboardEntry]
    user_rank: Optional[int]
