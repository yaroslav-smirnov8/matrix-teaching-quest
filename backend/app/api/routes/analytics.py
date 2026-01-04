from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc
from typing import Optional
from datetime import datetime
from pydantic import BaseModel

from app.db.database import get_db
from app.models.user import User
from app.models.analytics import AnalyticsEvent

router = APIRouter()

class TrackEventRequest(BaseModel):
    user_id: str
    fingerprint: str
    session_id: Optional[str] = None
    event_type: str
    event_data: dict = {}
    is_returning_user: bool = False

@router.post("/track")
async def track_event(
    request: TrackEventRequest,
    db: AsyncSession = Depends(get_db)
):
    """Отследить событие пользователя"""
    
    # Найти или создать пользователя
    result = await db.execute(
        select(User).where(User.user_id == request.user_id)
    )
    user = result.scalar_one_or_none()
    
    if not user:
        # Создать нового пользователя
        user = User(
            user_id=request.user_id,
            fingerprint=request.fingerprint,
            session_id=request.session_id,
            device_type=request.event_data.get('deviceType'),
            browser=request.event_data.get('browser'),
            os=request.event_data.get('os'),
            screen_resolution=request.event_data.get('screenResolution'),
            language_code=request.event_data.get('language', 'en'),
            start_time=datetime.utcnow()
        )
        db.add(user)
    else:
        # Обновить информацию о пользователе
        user.last_activity = datetime.utcnow()
        user.fingerprint = request.fingerprint
        if request.session_id:
            user.session_id = request.session_id
    
    # Создать событие
    event = AnalyticsEvent(
        user_id=request.user_id,
        fingerprint=request.fingerprint,
        session_id=request.session_id,
        event_type=request.event_type,
        event_data=request.event_data,
        device_type=request.event_data.get('deviceType'),
        browser=request.event_data.get('browser'),
        os=request.event_data.get('os')
    )
    
    db.add(event)
    
    # Обновить прогресс квеста
    if request.event_type == 'quest_start':
        user.start_time = datetime.utcnow()
    elif request.event_type == 'quest_complete':
        user.quest_completed = True
        user.completion_time = request.event_data.get('completion_time', 0)
    elif request.event_type == 'choice_made':
        scene_id = request.event_data.get('scene_id')
        choice_id = request.event_data.get('choice_id')
        if scene_id and choice_id:
            choices = user.choices_made or {}
            choices[scene_id] = choice_id
            user.choices_made = choices
    
    await db.commit()
    
    return {
        "status": "success",
        "event_id": event.id,
        "user_id": user.id
    }
