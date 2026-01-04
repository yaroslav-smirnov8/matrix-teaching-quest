from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.models.user import User
from app.models.quest import Achievement, UserAchievement

class AchievementService:
    """Service for managing achievements and checking unlock conditions"""
    
    def __init__(self):
        self.achievements = self._load_achievements()
    
    def _load_achievements(self) -> Dict[str, Dict[str, Any]]:
        """Load all available achievements"""
        return {
            "glitch_hunter": {
                "name": "Glitch Hunter",
                "description": "Find all hidden glitches in the system",
                "icon": "🔍",
                "requirements": {
                    "type": "easter_eggs",
                    "count": 5,
                    "specific": ["glitch1", "glitch2", "glitch3", "glitch4", "glitch5"]
                },
                "reward_type": "badge"
            },
            "speed_runner": {
                "name": "Speed Runner",
                "description": "Complete the quest in less than 5 minutes",
                "icon": "⚡",
                "requirements": {
                    "type": "completion_time",
                    "max_seconds": 300
                },
                "reward_type": "promo_code",
                "reward_value": "BULLET_TIME"
            },
            "perfect_code": {
                "name": "Perfect Code",
                "description": "Complete the quest without a single mistake",
                "icon": "💎",
                "requirements": {
                    "type": "perfect_run",
                    "no_wrong_choices": True
                },
                "reward_type": "vip_status"
            },
            "evangelist": {
                "name": "Evangelist",
                "description": "Share the quest with 3+ friends",
                "icon": "📢",
                "requirements": {
                    "type": "shares",
                    "min_count": 3
                },
                "reward_type": "secret_level"
            },
            "white_rabbit_collector": {
                "name": "White Rabbit Collector",
                "description": "Find all white rabbits",
                "icon": "🐰",
                "requirements": {
                    "type": "white_rabbits",
                    "count": 5
                },
                "reward_type": "promo_code",
                "reward_value": "TRINITY"
            },
            "matrix_master": {
                "name": "Matrix Master",
                "description": "Get all other achievements",
                "icon": "👑",
                "requirements": {
                    "type": "all_achievements",
                    "exclude": ["matrix_master"]
                },
                "reward_type": "special_recognition"
            },
            "deja_vu": {
                "name": "Deja Vu",
                "description": "Click the black cat twice",
                "icon": "🐱",
                "requirements": {
                    "type": "easter_egg",
                    "specific": "black_cat_double_click"
                },
                "reward_type": "easter_egg"
            },
            "spoon_bender": {
                "name": "Spoon Bender",
                "description": "Enter the secret phrase",
                "icon": "🥄",
                "requirements": {
                    "type": "easter_egg",
                    "specific": "there_is_no_spoon"
                },
                "reward_type": "bonus_hint"
            },
            "code_breaker": {
                "name": "Code Breaker",
                "description": "Enter secret code 2319",
                "icon": "🔓",
                "requirements": {
                    "type": "easter_egg",
                    "specific": "secret_code_2319"
                },
                "reward_type": "secret_message"
            }
        }
    
    async def check_achievements(self, user: User, db: AsyncSession) -> List[str]:
        """Check and award new achievements for user"""
        new_achievements = []
        
        for achievement_id, achievement_data in self.achievements.items():
            # Skip if user already has this achievement
            if achievement_id in (user.achievements or []):
                continue
            
            # Check if requirements are met
            if await self._check_requirements(user, achievement_data["requirements"], db):
                await self._award_achievement(user, achievement_id, db)
                new_achievements.append(achievement_id)
        
        return new_achievements
    
    async def _check_requirements(
        self, 
        user: User, 
        requirements: Dict[str, Any], 
        db: AsyncSession
    ) -> bool:
        """Check if user meets achievement requirements"""
        req_type = requirements.get("type")
        
        if req_type == "completion_time":
            return (user.completion_time and 
                   user.completion_time <= requirements.get("max_seconds", float('inf')))
        
        elif req_type == "white_rabbits":
            return user.white_rabbits_found >= requirements.get("count", 0)
        
        elif req_type == "easter_eggs":
            if "specific" in requirements:
                specific_eggs = requirements["specific"]
                found_eggs = user.easter_eggs_found or []
                return all(egg in found_eggs for egg in specific_eggs)
            else:
                count = requirements.get("count", 0)
                return len(user.easter_eggs_found or []) >= count
        
        elif req_type == "easter_egg":
            specific_egg = requirements.get("specific")
            found_eggs = user.easter_eggs_found or []
            return specific_egg in found_eggs
        
        elif req_type == "perfect_run":
            # Check if user made any wrong choices
            choices = user.choices_made or {}
            wrong_choices = ["close_message", "blue_pill"]  # Define wrong choices
            return not any(choice in wrong_choices for choice in choices.values())
        
        elif req_type == "shares":
            # This would be tracked separately in a shares table
            # For now, return False as placeholder
            return False
        
        elif req_type == "all_achievements":
            exclude = requirements.get("exclude", [])
            required_achievements = [
                aid for aid in self.achievements.keys() 
                if aid not in exclude
            ]
            user_achievements = user.achievements or []
            return all(aid in user_achievements for aid in required_achievements)
        
        return False
    
    async def _award_achievement(
        self, 
        user: User, 
        achievement_id: str, 
        db: AsyncSession
    ):
        """Award achievement to user"""
        # Add to user's achievements list
        if not user.achievements:
            user.achievements = []
        user.achievements.append(achievement_id)
        
        # Create achievement record
        user_achievement = UserAchievement(
            user_id=user.id,
            achievement_id=achievement_id
        )
        db.add(user_achievement)
        
        # Handle special rewards
        achievement_data = self.achievements[achievement_id]
        if achievement_data.get("reward_type") == "promo_code":
            from app.services.promo_service import PromoService
            promo_service = PromoService()
            reward_value = achievement_data.get("reward_value")
            if reward_value:
                await promo_service.generate_bonus_code(user, reward_value.lower(), db)
    
    async def get_user_achievements(
        self, 
        user: User, 
        db: AsyncSession
    ) -> List[Dict[str, Any]]:
        """Get all achievements for user with details"""
        user_achievements = []
        
        # Get achievement records with timestamps
        result = await db.execute(
            select(UserAchievement).where(UserAchievement.user_id == user.id)
        )
        achievement_records = result.scalars().all()
        
        # Create lookup for earned timestamps
        earned_lookup = {
            record.achievement_id: record.earned_at 
            for record in achievement_records
        }
        
        # Build response
        for achievement_id, achievement_data in self.achievements.items():
            user_achievement = {
                "id": achievement_id,
                "name": achievement_data["name"],
                "description": achievement_data["description"],
                "icon": achievement_data["icon"],
                "earned": achievement_id in (user.achievements or []),
                "earned_at": earned_lookup.get(achievement_id)
            }
            user_achievements.append(user_achievement)
        
        return user_achievements
    
    def get_achievement_progress(self, user: User, achievement_id: str) -> Dict[str, Any]:
        """Get progress towards a specific achievement"""
        if achievement_id not in self.achievements:
            return {}
        
        achievement = self.achievements[achievement_id]
        requirements = achievement["requirements"]
        req_type = requirements.get("type")
        
        progress = {
            "achievement_id": achievement_id,
            "completed": achievement_id in (user.achievements or []),
            "progress": 0,
            "total": 1
        }
        
        if req_type == "white_rabbits":
            total = requirements.get("count", 5)
            current = user.white_rabbits_found
            progress.update({
                "progress": min(current, total),
                "total": total,
                "percentage": min(100, (current / total) * 100)
            })
        
        elif req_type == "easter_eggs":
            if "specific" in requirements:
                specific_eggs = requirements["specific"]
                found_eggs = user.easter_eggs_found or []
                found_count = sum(1 for egg in specific_eggs if egg in found_eggs)
                progress.update({
                    "progress": found_count,
                    "total": len(specific_eggs),
                    "percentage": (found_count / len(specific_eggs)) * 100
                })
        
        return progress
