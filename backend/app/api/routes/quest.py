from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Dict, Any
import time
from datetime import datetime

from app.db.database import get_db
from app.models.user import User
from app.models.quest import QuestProgress, Choice, QuestScene
from app.schemas.quest import QuestStartRequest, QuestStartResponse, ChoiceRequest, ChoiceResponse
from app.services.quest_service import QuestService
from app.services.achievement_service import AchievementService

router = APIRouter()

@router.post("/start", response_model=QuestStartResponse)
async def start_quest(
    request: QuestStartRequest,
    db: AsyncSession = Depends(get_db)
):
    """Start the Matrix quest for a user"""
    
    # Check if user exists, create if not
    result = await db.execute(select(User).where(User.user_id == request.telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        user = User(
            user_id=request.telegram_id,
            fingerprint=request.telegram_id,  # Fallback
            language_code=request.language_code,
            start_time=datetime.utcnow(),
            current_scene="loading"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    else:
        # Update last activity
        user.last_activity = datetime.utcnow()
        if not user.start_time:
            user.start_time = datetime.utcnow()
        await db.commit()
    
    # Get the loading scene content
    quest_service = QuestService()
    scene_content = quest_service.get_scene_content("loading")
    
    return QuestStartResponse(
        user_id=user.id,
        scene_id="loading",
        scene_content=scene_content,
        message="Welcome to the Matrix, Neo..."
    )

@router.post("/choice", response_model=ChoiceResponse)
async def make_choice(
    request: ChoiceRequest,
    db: AsyncSession = Depends(get_db)
):
    """Process user choice and advance quest"""
    
    # Get user, create if not exists (for demo/browser mode)
    result = await db.execute(select(User).where(User.user_id == request.telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        # Create demo user for browser testing
        user = User(
            user_id=request.telegram_id,
            fingerprint=request.telegram_id,
            language_code="en",
            start_time=datetime.utcnow(),
            current_scene="scene1"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    # Record the choice
    choice = Choice(
        user_id=user.id,
        scene_id=request.scene_id,
        choice_id=request.choice_id,
        choice_text=request.choice_text
    )
    db.add(choice)
    
    # Update user's choices
    if not user.choices_made:
        user.choices_made = {}
    user.choices_made[request.scene_id] = request.choice_id
    
    # Determine next scene
    quest_service = QuestService()
    next_scene_id = quest_service.get_next_scene(request.scene_id, request.choice_id)
    
    # Update user's current scene
    user.current_scene = next_scene_id
    user.last_activity = datetime.utcnow()
    
    # Check for quest completion
    if next_scene_id in ["portal_chosen", "epilogue"]:
        user.quest_completed = True
        if user.start_time:
            user.completion_time = int((datetime.utcnow() - user.start_time).total_seconds())
    
    await db.commit()
    
    # Check for achievements (simplified for now)
    achievements_earned = []
    
    # Generate promo code if quest completed (simplified for now)
    promo_code = None
    if user.quest_completed and not user.generated_promo_code:
        promo_code = f"MATRIX{user.id}{int(time.time())}"
        user.generated_promo_code = promo_code
        await db.commit()
    
    # Get next scene content
    scene_content = quest_service.get_scene_content(next_scene_id)
    
    return ChoiceResponse(
        next_scene_id=next_scene_id,
        scene_content=scene_content,
        achievements_earned=achievements_earned,
        promo_code=promo_code
    )

@router.get("/scene/{scene_id}")
async def get_scene(scene_id: str):
    """Get scene content by ID"""
    quest_service = QuestService()
    scene_content = quest_service.get_scene_content(scene_id)
    
    if not scene_content:
        raise HTTPException(status_code=404, detail="Scene not found")
    
    return {"scene_id": scene_id, "content": scene_content}

@router.post("/easter-egg")
async def trigger_easter_egg(
    telegram_id: str,
    easter_egg_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Trigger an easter egg discovery"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Add easter egg to found list
    if not user.easter_eggs_found:
        user.easter_eggs_found = []
    
    if easter_egg_id not in user.easter_eggs_found:
        user.easter_eggs_found.append(easter_egg_id)
        
        # Special handling for white rabbit
        if easter_egg_id.startswith("white_rabbit"):
            user.white_rabbits_found += 1
    
    await db.commit()
    
    return {"message": "Easter egg discovered!", "easter_egg_id": easter_egg_id}
