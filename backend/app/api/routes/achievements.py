from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any

from app.db.database import get_db
from app.models.user import User
from app.models.quest import Achievement, UserAchievement
from app.schemas.quest import AchievementResponse
from app.services.achievement_service import AchievementService

router = APIRouter()

@router.get("/", response_model=List[AchievementResponse])
async def get_user_achievements(
    telegram_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all achievements for a user"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    achievement_service = AchievementService()
    achievements = await achievement_service.get_user_achievements(user, db)
    
    return [
        AchievementResponse(
            id=achievement["id"],
            name=achievement["name"],
            description=achievement["description"],
            icon=achievement["icon"],
            earned_at=achievement["earned_at"]
        )
        for achievement in achievements
        if achievement["earned"]
    ]

@router.get("/available", response_model=List[Dict[str, Any]])
async def get_available_achievements(
    telegram_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all available achievements with progress"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    achievement_service = AchievementService()
    achievements = await achievement_service.get_user_achievements(user, db)
    
    # Add progress information for each achievement
    achievements_with_progress = []
    for achievement in achievements:
        progress = achievement_service.get_achievement_progress(user, achievement["id"])
        achievement_data = {
            **achievement,
            "progress": progress
        }
        achievements_with_progress.append(achievement_data)
    
    return achievements_with_progress

@router.post("/check")
async def check_achievements(
    telegram_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Manually check and award achievements for a user"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    achievement_service = AchievementService()
    new_achievements = await achievement_service.check_achievements(user, db)
    
    return {
        "message": f"Checked achievements for user {telegram_id}",
        "new_achievements": new_achievements,
        "total_achievements": len(user.achievements or [])
    }

@router.get("/leaderboard")
async def get_achievement_leaderboard(
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get leaderboard based on achievement count"""
    
    # Get users with most achievements
    result = await db.execute(
        select(User)
        .where(User.achievements.isnot(None))
        .order_by(User.achievements.desc())
        .limit(limit)
    )
    users = result.scalars().all()
    
    leaderboard = []
    for rank, user in enumerate(users, 1):
        achievement_count = len(user.achievements or [])
        if achievement_count > 0:
            leaderboard.append({
                "rank": rank,
                "username": user.user_id or f"User{user.id}",
                "achievement_count": achievement_count,
                "quest_completed": user.quest_completed,
                "completion_time": user.completion_time
            })
    
    return {
        "leaderboard": leaderboard,
        "total_users": len(leaderboard)
    }

@router.get("/stats")
async def get_achievement_stats(db: AsyncSession = Depends(get_db)):
    """Get global achievement statistics"""
    
    # Get all users
    result = await db.execute(select(User))
    all_users = result.scalars().all()
    
    # Calculate stats
    total_users = len(all_users)
    completed_users = len([u for u in all_users if u.quest_completed])
    
    # Achievement distribution
    achievement_service = AchievementService()
    achievement_counts = {}
    
    for achievement_id in achievement_service.achievements.keys():
        count = len([u for u in all_users if achievement_id in (u.achievements or [])])
        achievement_counts[achievement_id] = {
            "count": count,
            "percentage": (count / total_users * 100) if total_users > 0 else 0,
            "name": achievement_service.achievements[achievement_id]["name"]
        }
    
    # White rabbit stats
    total_rabbits_found = sum(u.white_rabbits_found for u in all_users)
    users_with_all_rabbits = len([u for u in all_users if u.white_rabbits_found >= 5])
    
    return {
        "total_users": total_users,
        "completed_users": completed_users,
        "completion_rate": (completed_users / total_users * 100) if total_users > 0 else 0,
        "achievement_distribution": achievement_counts,
        "white_rabbit_stats": {
            "total_found": total_rabbits_found,
            "users_with_all": users_with_all_rabbits,
            "average_per_user": total_rabbits_found / total_users if total_users > 0 else 0
        }
    }
