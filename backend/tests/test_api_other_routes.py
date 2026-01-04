from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi.testclient import TestClient

from app.db.database import get_db
from app.models.quest import PromoCode
from app.models.user import User
from main import app


@pytest.fixture
def client():
    original_overrides = dict(app.dependency_overrides)
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()
        app.dependency_overrides.update(original_overrides)


def test_admin_users_requires_basic_auth(client):
    resp = client.get("/api/v1/admin/users")
    assert resp.status_code == 401


def test_admin_users_returns_empty_list_with_valid_auth(client):
    db = AsyncMock()
    db.execute = AsyncMock()

    list_result = MagicMock()
    list_result.scalars.return_value.all.return_value = []

    count_result = MagicMock()
    count_result.scalar.return_value = 0

    db.execute.side_effect = [list_result, count_result]

    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    resp = client.get("/api/v1/admin/users", auth=("admin", "matrix2025"))
    assert resp.status_code == 200
    payload = resp.json()
    assert payload["users"] == []
    assert payload["total"] == 0


def test_user_progress_404_when_user_missing(client):
    db = AsyncMock()
    execute_result = MagicMock()
    execute_result.scalar_one_or_none.return_value = None
    db.execute = AsyncMock(return_value=execute_result)

    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    resp = client.get("/api/v1/user/progress", params={"telegram_id": "missing"})
    assert resp.status_code == 404
    assert resp.json()["detail"] == "User not found"


def test_user_reset_resets_progress_fields_and_commits(client):
    user = User(user_id="u1")
    user.id = 1
    user.current_scene = "scene2"
    user.quest_completed = True
    user.completion_time = 123
    user.choices_made = {"scene1": "follow_rabbit"}
    user.achievements = ["speed_runner"]
    user.white_rabbits_found = 2
    user.easter_eggs_found = ["glitch1"]
    user.generated_promo_code = "MATRIXABC123"
    user.promo_code_used = True
    user.start_time = datetime.utcnow()
    user.total_playtime = 456

    db = AsyncMock()
    execute_result = MagicMock()
    execute_result.scalar_one_or_none.return_value = user
    db.execute = AsyncMock(return_value=execute_result)

    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    resp = client.delete("/api/v1/user/reset", params={"telegram_id": "u1"})
    assert resp.status_code == 200
    assert user.current_scene == "loading"
    assert user.quest_completed is False
    assert user.completion_time is None
    assert user.choices_made == {}
    assert user.achievements == []
    assert user.white_rabbits_found == 0
    assert user.easter_eggs_found == []
    assert user.generated_promo_code is None
    assert user.promo_code_used is False
    assert user.start_time is None
    assert user.total_playtime == 0
    assert db.commit.await_count == 1


def test_achievements_endpoint_returns_only_earned(client):
    user = User(user_id="u1")
    user.id = 1
    user.achievements = ["speed_runner"]

    db = AsyncMock()
    execute_result = MagicMock()
    execute_result.scalar_one_or_none.return_value = user
    db.execute = AsyncMock(return_value=execute_result)

    async def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db

    mocked = [
        {
            "id": "speed_runner",
            "name": "Speed Runner",
            "description": "Complete the quest in less than 5 minutes",
            "icon": "⚡",
            "earned": True,
            "earned_at": None,
        },
        {
            "id": "glitch_hunter",
            "name": "Glitch Hunter",
            "description": "Find all hidden glitches in the system",
            "icon": "🔍",
            "earned": False,
            "earned_at": None,
        },
    ]

    with patch("app.services.achievement_service.AchievementService.get_user_achievements", new=AsyncMock(return_value=mocked)):
        resp = client.get("/api/v1/achievements/", params={"telegram_id": "u1"})

    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 1
    assert data[0]["id"] == "speed_runner"


def test_promo_validate_returns_404_when_invalid_code(client):
    with patch("app.services.promo_service.PromoService.validate_promo_code", new=AsyncMock(return_value=None)):
        resp = client.get("/api/v1/promo/validate/INVALID")
    assert resp.status_code == 404


def test_promo_validate_returns_payload_when_valid(client):
    promo = PromoCode(code="MATRIXABC123", user_id=1, discount_type="MATRIX", discount_value=30)
    promo.generated_at = datetime.utcnow()
    promo.used_at = None

    with patch("app.services.promo_service.PromoService.validate_promo_code", new=AsyncMock(return_value=promo)):
        resp = client.get("/api/v1/promo/validate/MATRIXABC123")

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["valid"] is True
    assert payload["code"] == "MATRIXABC123"
    assert payload["used"] is False


def test_promo_use_returns_400_when_invalid(client):
    with patch("app.services.promo_service.PromoService.use_promo_code", new=AsyncMock(return_value=False)):
        resp = client.post("/api/v1/promo/use/INVALID")
    assert resp.status_code == 400
