from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.db.database import get_db
from app.models.user import User
from app.models.quest import PromoCode
from app.schemas.quest import PromoCodeResponse
from app.services.promo_service import PromoService
from app.core.config import settings

router = APIRouter()

@router.post("/generate", response_model=PromoCodeResponse)
async def generate_promo_code(
    telegram_id: str,
    portal_choice: str,
    db: AsyncSession = Depends(get_db)
):
    """Generate a promo code for user based on their portal choice"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.quest_completed:
        raise HTTPException(status_code=400, detail="Quest not completed")
    
    promo_service = PromoService()
    promo_code = await promo_service.generate_promo_code(user, portal_choice, db)
    
    if not promo_code:
        raise HTTPException(status_code=400, detail="Invalid portal choice")
    
    # Get promo code details
    result = await db.execute(select(PromoCode).where(PromoCode.code == promo_code))
    promo_record = result.scalar_one_or_none()
    
    if not promo_record:
        raise HTTPException(status_code=500, detail="Failed to create promo code")
    
    course_url = promo_service.get_course_url(promo_code)
    
    return PromoCodeResponse(
        code=promo_code,
        discount_type=promo_record.discount_type,
        discount_value=promo_record.discount_value,
        course_url=course_url,
        expires_at=None  # No expiration for now
    )

@router.post("/bonus")
async def generate_bonus_code(
    telegram_id: str,
    bonus_type: str,
    db: AsyncSession = Depends(get_db)
):
    """Generate bonus promo code for achievements"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    promo_service = PromoService()
    
    # Validate bonus type and requirements
    if bonus_type == "trinity" and user.white_rabbits_found < 5:
        raise HTTPException(status_code=400, detail="Not all white rabbits found")
    
    if bonus_type == "bullet_time" and (not user.completion_time or user.completion_time >= 300000):
        raise HTTPException(status_code=400, detail="Speed run requirement not met")
    
    promo_code = await promo_service.generate_bonus_code(user, bonus_type, db)
    
    if not promo_code:
        raise HTTPException(status_code=400, detail="Invalid bonus type")
    
    # Get promo code details
    result = await db.execute(select(PromoCode).where(PromoCode.code == promo_code))
    promo_record = result.scalar_one_or_none()
    
    course_url = promo_service.get_course_url(promo_code)
    
    return PromoCodeResponse(
        code=promo_code,
        discount_type=promo_record.discount_type,
        discount_value=promo_record.discount_value,
        course_url=course_url,
        expires_at=None
    )

@router.get("/validate/{code}")
async def validate_promo_code(
    code: str,
    db: AsyncSession = Depends(get_db)
):
    """Validate a promo code"""
    
    promo_service = PromoService()
    promo_code = await promo_service.validate_promo_code(code, db)
    
    if not promo_code:
        raise HTTPException(status_code=404, detail="Invalid or expired promo code")
    
    return {
        "valid": True,
        "code": promo_code.code,
        "discount_type": promo_code.discount_type,
        "discount_value": promo_code.discount_value,
        "generated_at": promo_code.generated_at,
        "used": promo_code.used_at is not None
    }

@router.post("/use/{code}")
async def use_promo_code(
    code: str,
    db: AsyncSession = Depends(get_db)
):
    """Mark promo code as used"""
    
    promo_service = PromoService()
    success = await promo_service.use_promo_code(code, db)
    
    if not success:
        raise HTTPException(status_code=400, detail="Invalid promo code or already used")
    
    return {"message": "Promo code used successfully"}

@router.get("/user/{telegram_id}")
async def get_user_promo_codes(
    telegram_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get all promo codes for a user"""
    
    result = await db.execute(select(User).where(User.user_id == telegram_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get all promo codes for this user
    result = await db.execute(
        select(PromoCode).where(PromoCode.user_id == user.id)
    )
    promo_codes = result.scalars().all()
    
    promo_service = PromoService()
    codes_data = []
    
    for promo in promo_codes:
        codes_data.append({
            "code": promo.code,
            "discount_type": promo.discount_type,
            "discount_value": promo.discount_value,
            "course_url": promo_service.get_course_url(promo.code),
            "generated_at": promo.generated_at,
            "used_at": promo.used_at,
            "is_active": promo.is_active
        })
    
    return {
        "user_id": user.id,
        "telegram_id": telegram_id,
        "promo_codes": codes_data,
        "total_codes": len(codes_data)
    }

@router.get("/stats")
async def get_promo_stats(db: AsyncSession = Depends(get_db)):
    """Get promo code usage statistics"""
    
    # Get all promo codes
    result = await db.execute(select(PromoCode))
    all_codes = result.scalars().all()
    
    # Calculate stats by type
    stats_by_type = {}
    total_generated = len(all_codes)
    total_used = len([code for code in all_codes if code.used_at])
    
    for code in all_codes:
        discount_type = code.discount_type
        if discount_type not in stats_by_type:
            stats_by_type[discount_type] = {
                "generated": 0,
                "used": 0,
                "total_discount_value": 0
            }
        
        stats_by_type[discount_type]["generated"] += 1
        stats_by_type[discount_type]["total_discount_value"] += code.discount_value
        
        if code.used_at:
            stats_by_type[discount_type]["used"] += 1
    
    # Calculate usage rates
    for discount_type in stats_by_type:
        generated = stats_by_type[discount_type]["generated"]
        used = stats_by_type[discount_type]["used"]
        stats_by_type[discount_type]["usage_rate"] = (used / generated * 100) if generated > 0 else 0
    
    return {
        "total_generated": total_generated,
        "total_used": total_used,
        "overall_usage_rate": (total_used / total_generated * 100) if total_generated > 0 else 0,
        "stats_by_type": stats_by_type
    }
