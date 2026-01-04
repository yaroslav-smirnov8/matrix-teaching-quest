from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.db.database import get_db
from app.models.user import User
from app.models.quest import UserAchievement, PromoCode
from app.schemas.quest import UserProgressResponse, LeaderboardResponse, LeaderboardEntry
from app.services.achievement_service import AchievementService

router = APIRouter()

@router.get("/progress", response_model=UserProgressResponse)
async def get_user_progress(
    telegram_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get user's quest progress and statistics"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return UserProgressResponse(
        current_scene=user.current_scene,
        quest_completed=user.quest_completed,
        completion_time=user.completion_time,
        achievements=user.achievements or [],
        white_rabbits_found=user.white_rabbits_found,
        easter_eggs_found=user.easter_eggs_found or [],
        generated_promo_code=user.generated_promo_code,
        total_playtime=user.total_playtime
    )

@router.get("/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(
    telegram_id: str = None,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get leaderboard with top players"""
    
    # Get top players by completion time
    result = await db.execute(
        select(User)
        .where(User.quest_completed == True, User.completion_time.isnot(None))
        .order_by(User.completion_time.asc())
        .limit(limit)
    )
    top_users = result.scalars().all()
    
    # Build leaderboard entries
    entries = []
    for rank, user in enumerate(top_users, 1):
        # Count achievements
        achievement_count = len(user.achievements or [])
        
        entries.append(LeaderboardEntry(
            username=user.user_id or f"User{user.id}",
            completion_time=user.completion_time,
            achievements_count=achievement_count,
            rank=rank
        ))
    
    # Find current user's rank if provided
    user_rank = None
    if telegram_id:
        user_result = await db.execute(select(User).where(User.user_id == telegram_id))
        current_user = user_result.scalar_one_or_none()
        
        if current_user and current_user.quest_completed and current_user.completion_time:
            # Count users with better completion times
            better_users_result = await db.execute(
                select(User)
                .where(
                    User.quest_completed == True,
                    User.completion_time < current_user.completion_time
                )
            )
            better_users_count = len(better_users_result.scalars().all())
            user_rank = better_users_count + 1
    
    return LeaderboardResponse(
        entries=entries,
        user_rank=user_rank
    )

@router.post("/share")
async def record_share(
    telegram_id: str,
    platform: str = "telegram",
    db: AsyncSession = Depends(get_db)
):
    """Record that user shared the quest"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # This would typically be tracked in a separate shares table
    # For now, we'll add it to easter eggs found
    if not user.easter_eggs_found:
        user.easter_eggs_found = []
    
    share_key = f"shared_{platform}"
    if share_key not in user.easter_eggs_found:
        user.easter_eggs_found.append(share_key)
        await db.commit()
    
    # Check for evangelist achievement
    share_count = len([egg for egg in user.easter_eggs_found if egg.startswith("shared_")])
    if share_count >= 3:
        achievement_service = AchievementService()
        await achievement_service.check_achievements(user, db)
    
    return {"message": "Share recorded", "total_shares": share_count}

@router.delete("/reset")
async def reset_user_progress(
    telegram_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Reset user's quest progress (for testing/replay)"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Reset quest progress but keep user data
    user.current_scene = "loading"
    user.quest_completed = False
    user.completion_time = None
    user.choices_made = {}
    user.achievements = []
    user.white_rabbits_found = 0
    user.easter_eggs_found = []
    user.generated_promo_code = None
    user.promo_code_used = False
    user.start_time = None
    user.total_playtime = 0
    
    await db.commit()
    
    return {"message": "User progress reset successfully"}

@router.get("/stats")
async def get_user_stats(
    telegram_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get detailed user statistics"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get achievement details
    achievement_service = AchievementService()
    user_achievements = await achievement_service.get_user_achievements(user, db)
    
    # Calculate completion percentage
    total_scenes = 10  # Approximate number of scenes
    current_scene_progress = {
        "loading": 0,
        "scene1": 10,
        "scene2": 20,
        "scene3a": 30,
        "challenge1": 50,
        "challenge2": 70,
        "final_choice": 90,
        "epilogue": 100
    }
    
    progress_percentage = current_scene_progress.get(user.current_scene, 0)
    
    return {
        "user_id": user.id,
        "telegram_id": user.user_id,
        "username": user.user_id,
        "current_scene": user.current_scene,
        "quest_completed": user.quest_completed,
        "progress_percentage": progress_percentage,
        "completion_time": user.completion_time,
        "total_playtime": user.total_playtime,
        "achievements": user_achievements,
        "white_rabbits_found": user.white_rabbits_found,
        "easter_eggs_found": user.easter_eggs_found or [],
        "choices_made": user.choices_made or {},
        "has_promo_code": bool(user.generated_promo_code),
        "created_at": user.created_at,
        "last_activity": user.last_activity
    }
