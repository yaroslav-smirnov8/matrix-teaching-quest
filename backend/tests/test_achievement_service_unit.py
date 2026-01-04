import asyncio
from unittest.mock import AsyncMock, MagicMock, patch


def test_check_requirements_completion_time_true():
    from app.models.user import User
    from app.services.achievement_service import AchievementService

    service = AchievementService()
    user = User(user_id="u1")
    user.completion_time = 120

    ok = asyncio.run(
        service._check_requirements(user, {"type": "completion_time", "max_seconds": 300}, db=AsyncMock())
    )
    assert ok is True


def test_check_requirements_perfect_run_false_when_wrong_choice_present():
    from app.models.user import User
    from app.services.achievement_service import AchievementService

    service = AchievementService()
    user = User(user_id="u1")
    user.choices_made = {"scene1": "close_message"}

    ok = asyncio.run(
        service._check_requirements(user, {"type": "perfect_run", "no_wrong_choices": True}, db=AsyncMock())
    )
    assert ok is False


def test_check_requirements_easter_eggs_specific_list():
    from app.models.user import User
    from app.services.achievement_service import AchievementService

    service = AchievementService()
    user = User(user_id="u1")
    user.easter_eggs_found = ["glitch1", "glitch2", "glitch3", "glitch4", "glitch5"]

    ok = asyncio.run(
        service._check_requirements(
            user,
            {"type": "easter_eggs", "specific": ["glitch1", "glitch2", "glitch3", "glitch4", "glitch5"]},
            db=AsyncMock(),
        )
    )
    assert ok is True


def test_get_achievement_progress_white_rabbits_tracks_percentage():
    from app.models.user import User
    from app.services.achievement_service import AchievementService

    service = AchievementService()
    user = User(user_id="u1")
    user.white_rabbits_found = 2

    progress = service.get_achievement_progress(user, "white_rabbit_collector")
    assert progress["progress"] == 2
    assert progress["total"] == 5
    assert 0 < progress["percentage"] < 100


def test_award_achievement_adds_user_achievement_record():
    from app.models.user import User
    from app.services.achievement_service import AchievementService

    service = AchievementService()
    user = User(user_id="u1")
    user.id = 10
    user.achievements = None

    db = AsyncMock()
    db.add = MagicMock()

    asyncio.run(service._award_achievement(user, "perfect_code", db))

    assert user.achievements == ["perfect_code"]
    assert db.add.call_count == 1


def test_award_achievement_triggers_bonus_code_for_promo_reward():
    from app.models.user import User
    from app.services.achievement_service import AchievementService

    service = AchievementService()
    user = User(user_id="u1")
    user.id = 10
    user.achievements = []

    db = AsyncMock()
    db.add = MagicMock()

    with patch("app.services.promo_service.PromoService.generate_bonus_code", new=AsyncMock()) as mocked:
        asyncio.run(service._award_achievement(user, "speed_runner", db))

    assert "speed_runner" in user.achievements
    assert mocked.await_count == 1

