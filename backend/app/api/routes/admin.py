from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, desc, and_
from typing import List, Optional
from datetime import datetime, timedelta

from app.db.database import get_db
from app.models.user import User
from app.models.analytics import AnalyticsEvent, QuestStatistics
from app.schemas.admin import (
    UserListResponse, UserDetailResponse, AnalyticsOverview,
    SceneAnalytics, UserJourneyResponse
)
from app.core.auth import verify_admin

router = APIRouter()

# Все endpoints защищены HTTP Basic Auth

@router.get("/users", response_model=UserListResponse, dependencies=[Depends(verify_admin)])
async def get_users(
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None,
    completed_only: bool = False,
    db: AsyncSession = Depends(get_db)
):
    """Получить список всех пользователей с фильтрацией"""
    
    query = select(User)
    
    # Фильтры
    if search:
        query = query.where(
            (User.user_id.ilike(f"%{search}%")) |
            (User.fingerprint.ilike(f"%{search}%")) |
            (User.browser.ilike(f"%{search}%"))
        )
    
    if completed_only:
        query = query.where(User.quest_completed == True)
    
    # Сортировка по последней активности
    query = query.order_by(desc(User.last_activity))
    
    # Пагинация
    query = query.offset(skip).limit(limit)
    
    result = await db.execute(query)
    users = result.scalars().all()
    
    # Подсчет общего количества
    count_query = select(func.count(User.id))
    if search:
        count_query = count_query.where(
            (User.user_id.ilike(f"%{search}%")) |
            (User.fingerprint.ilike(f"%{search}%")) |
            (User.browser.ilike(f"%{search}%"))
        )
    if completed_only:
        count_query = count_query.where(User.quest_completed == True)
    
    total_result = await db.execute(count_query)
    total = total_result.scalar()
    
    return {
        "users": users,
        "total": total,
        "skip": skip,
        "limit": limit
    }

@router.get("/users/{user_id}", response_model=UserDetailResponse)
async def get_user_detail(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Получить детальную информацию о пользователе"""
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Получить события пользователя
    events_result = await db.execute(
        select(AnalyticsEvent)
        .where(AnalyticsEvent.user_id == user_id)
        .order_by(desc(AnalyticsEvent.timestamp))
        .limit(100)
    )
    events = events_result.scalars().all()
    
    return {
        "user": user,
        "events": events,
        "total_events": len(events)
    }

@router.get("/analytics/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(
    days: int = 7,
    db: AsyncSession = Depends(get_db)
):
    """Получить общую аналитику за период"""
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Общее количество пользователей
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar()
    
    # Новые пользователи за период
    new_users_result = await db.execute(
        select(func.count(User.id))
        .where(User.created_at >= start_date)
    )
    new_users = new_users_result.scalar()
    
    # Активные пользователи за период
    active_users_result = await db.execute(
        select(func.count(User.id))
        .where(User.last_activity >= start_date)
    )
    active_users = active_users_result.scalar()
    
    # Завершенные квесты
    completed_quests_result = await db.execute(
        select(func.count(User.id))
        .where(User.quest_completed == True)
    )
    completed_quests = completed_quests_result.scalar()
    
    # Средний completion rate
    completion_rate = (completed_quests / total_users * 100) if total_users > 0 else 0
    
    # Среднее время прохождения
    avg_time_result = await db.execute(
        select(func.avg(User.completion_time))
        .where(User.quest_completed == True)
    )
    avg_completion_time = avg_time_result.scalar() or 0
    
    # Промокоды
    promo_generated_result = await db.execute(
        select(func.count(User.id))
        .where(User.generated_promo_code.isnot(None))
    )
    promo_generated = promo_generated_result.scalar()
    
    promo_used_result = await db.execute(
        select(func.count(User.id))
        .where(User.promo_code_used == True)
    )
    promo_used = promo_used_result.scalar()
    
    return {
        "period_days": days,
        "total_users": total_users,
        "new_users": new_users,
        "active_users": active_users,
        "completed_quests": completed_quests,
        "completion_rate": round(completion_rate, 2),
        "avg_completion_time": round(avg_completion_time, 2),
        "promo_codes_generated": promo_generated,
        "promo_codes_used": promo_used,
        "promo_usage_rate": round((promo_used / promo_generated * 100) if promo_generated > 0 else 0, 2)
    }

@router.get("/analytics/scenes", response_model=List[SceneAnalytics])
async def get_scene_analytics(
    db: AsyncSession = Depends(get_db)
):
    """Получить аналитику по сценам (воронка)"""
    
    # Подсчет пользователей на каждой сцене
    scenes = [
        "loading", "scene1", "scene2", "scene3a", "scene3b",
        "challenge1", "challenge2", "final_choice", "epilogue"
    ]
    
    analytics = []
    total_users_result = await db.execute(select(func.count(User.id)))
    total_users = total_users_result.scalar()
    
    for scene in scenes:
        # Количество пользователей, достигших этой сцены
        users_reached_result = await db.execute(
            select(func.count(User.id))
            .where(User.choices_made.contains({scene: True}))
        )
        users_reached = users_reached_result.scalar()
        
        # Процент от общего числа
        percentage = (users_reached / total_users * 100) if total_users > 0 else 0
        
        analytics.append({
            "scene_id": scene,
            "users_reached": users_reached,
            "percentage": round(percentage, 2),
            "dropoff_rate": round(100 - percentage, 2) if scene != "loading" else 0
        })
    
    return analytics

@router.get("/analytics/user-journey/{user_id}", response_model=UserJourneyResponse)
async def get_user_journey(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """Получить путь пользователя по квесту"""
    
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Получить все события пользователя
    events_result = await db.execute(
        select(AnalyticsEvent)
        .where(AnalyticsEvent.user_id == user_id)
        .order_by(AnalyticsEvent.timestamp)
    )
    events = events_result.scalars().all()
    
    # Построить timeline
    timeline = []
    for event in events:
        timeline.append({
            "timestamp": event.timestamp,
            "event_type": event.event_type,
            "event_data": event.event_data
        })
    
    return {
        "user_id": user_id,
        "user_identifier": user.user_id,
        "fingerprint": user.fingerprint,
        "started_at": user.start_time,
        "completed": user.quest_completed,
        "current_scene": user.current_scene,
        "choices_made": user.choices_made,
        "timeline": timeline,
        "total_playtime": user.total_playtime
    }

# Track endpoint moved to /api/v1/analytics/track

@router.get("/export/users")
async def export_users(
    format: str = "csv",
    db: AsyncSession = Depends(get_db)
):
    """Экспортировать данные пользователей"""
    
    result = await db.execute(select(User))
    users = result.scalars().all()
    
    if format == "csv":
        import csv
        from io import StringIO
        
        output = StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow([
            "ID", "User ID", "Fingerprint", "Device", "Browser", "OS",
            "Created At", "Quest Completed", "Promo Code", "Last Activity"
        ])
        
        # Data
        for user in users:
            writer.writerow([
                user.id,
                user.user_id,
                user.fingerprint or "",
                user.device_type or "",
                user.browser or "",
                user.os or "",
                user.created_at.isoformat() if user.created_at else "",
                "Yes" if user.quest_completed else "No",
                user.generated_promo_code or "",
                user.last_activity.isoformat() if user.last_activity else ""
            ])
        
        return {
            "format": "csv",
            "data": output.getvalue(),
            "filename": f"users_export_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.csv"
        }
    
    # JSON format
    return {
        "format": "json",
        "data": [
            {
                "id": user.id,
                "user_id": user.user_id,
                "fingerprint": user.fingerprint,
                "device_type": user.device_type,
                "browser": user.browser,
                "os": user.os,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "quest_completed": user.quest_completed,
                "promo_code": user.generated_promo_code,
                "last_activity": user.last_activity.isoformat() if user.last_activity else None
            }
            for user in users
        ]
    }
