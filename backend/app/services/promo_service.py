import random
import string
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime

from app.models.user import User
from app.models.quest import PromoCode
from app.core.config import settings

class PromoService:
    """Service for generating and managing promo codes"""
    
    def __init__(self):
        self.promo_types = {
            "matrix": {
                "prefix": "MATRIX",
                "discount": settings.MATRIX_DISCOUNT,
                "description": "Discount for 'Matrix Teaching' course"
            }
        }
    
    async def generate_promo_code(
        self, 
        user: User, 
        portal_choice: str, 
        db: AsyncSession
    ) -> Optional[str]:
        """Generate a promo code based on user's portal choice"""
        
        # All portal choices now generate the same matrix promo code
        promo_type = "matrix"
        
        # Check if user already has a promo code
        if user.generated_promo_code:
            return user.generated_promo_code
        
        # Generate unique code
        base_code = self.promo_types[promo_type]["prefix"]
        unique_suffix = self._generate_unique_suffix()
        promo_code = f"{base_code}{unique_suffix}"
        
        # Ensure uniqueness
        while await self._code_exists(promo_code, db):
            unique_suffix = self._generate_unique_suffix()
            promo_code = f"{base_code}{unique_suffix}"
        
        # Create promo code record
        promo_record = PromoCode(
            code=promo_code,
            user_id=user.id,
            discount_type=promo_type.upper(),
            discount_value=self.promo_types[promo_type]["discount"]
        )
        db.add(promo_record)
        
        # Update user
        user.generated_promo_code = promo_code
        await db.commit()
        
        return promo_code
    
    async def generate_bonus_code(
        self, 
        user: User, 
        bonus_type: str, 
        db: AsyncSession
    ) -> Optional[str]:
        """Generate bonus promo codes for achievements - now returns same matrix code"""
        
        # All bonus codes are now the same matrix promo code
        return await self.generate_promo_code(user, "matrix", db)
    
    def _generate_unique_suffix(self, length: int = 6) -> str:
        """Generate a random alphanumeric suffix"""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    
    async def _code_exists(self, code: str, db: AsyncSession) -> bool:
        """Check if promo code already exists"""
        result = await db.execute(select(PromoCode).where(PromoCode.code == code))
        return result.scalar_one_or_none() is not None
    
    def get_course_url(self, promo_code: str) -> str:
        """Generate course URL with promo code"""
        return f"{settings.COURSE_BASE_URL}?promo={promo_code}"
    
    async def validate_promo_code(self, code: str, db: AsyncSession) -> Optional[PromoCode]:
        """Validate and return promo code if valid"""
        result = await db.execute(
            select(PromoCode).where(
                PromoCode.code == code,
                PromoCode.is_active == True,
                PromoCode.used_at.is_(None)
            )
        )
        return result.scalar_one_or_none()
    
    async def use_promo_code(self, code: str, db: AsyncSession) -> bool:
        """Mark promo code as used"""
        promo = await self.validate_promo_code(code, db)
        if not promo:
            return False
        
        promo.used_at = datetime.utcnow()
        await db.commit()
        return True
