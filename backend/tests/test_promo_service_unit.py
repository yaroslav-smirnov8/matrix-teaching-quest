import asyncio
import re
from unittest.mock import AsyncMock, MagicMock


def test_generate_unique_suffix_length_and_charset():
    from app.services.promo_service import PromoService

    suffix = PromoService()._generate_unique_suffix(length=8)
    assert len(suffix) == 8
    assert re.fullmatch(r"[A-Z0-9]{8}", suffix) is not None


def test_get_course_url_contains_promo_code():
    from app.services.promo_service import PromoService

    url = PromoService().get_course_url("MATRIXABC123")
    assert "promo=MATRIXABC123" in url


def test_generate_promo_code_returns_existing_code_without_db_calls():
    from app.services.promo_service import PromoService
    from app.models.user import User

    service = PromoService()
    user = User(user_id="u1")
    user.id = 123
    user.generated_promo_code = "MATRIXEXISTING"

    db = AsyncMock()
    result = asyncio.run(service.generate_promo_code(user, portal_choice="matrix", db=db))

    assert result == "MATRIXEXISTING"
    assert db.execute.await_count == 0


def test_generate_promo_code_persists_record_and_updates_user(monkeypatch):
    from app.services.promo_service import PromoService
    from app.models.user import User

    service = PromoService()
    user = User(user_id="u1")
    user.id = 1
    user.generated_promo_code = None

    monkeypatch.setattr(service, "_generate_unique_suffix", lambda length=6: "ABC123")

    execute_result = MagicMock()
    execute_result.scalar_one_or_none.return_value = None

    db = AsyncMock()
    db.execute.return_value = execute_result
    db.add = MagicMock()

    promo_code = asyncio.run(service.generate_promo_code(user, portal_choice="matrix", db=db))

    assert promo_code == "MATRIXABC123"
    assert user.generated_promo_code == "MATRIXABC123"
    assert db.add.call_count == 1
    assert db.commit.await_count == 1


def test_validate_promo_code_returns_promo_if_active_and_unused():
    from app.services.promo_service import PromoService
    from app.models.quest import PromoCode

    promo = PromoCode(code="MATRIXABC123", user_id=1, discount_type="MATRIX", discount_value=30)
    promo.is_active = True
    promo.used_at = None

    execute_result = MagicMock()
    execute_result.scalar_one_or_none.return_value = promo

    db = AsyncMock()
    db.execute.return_value = execute_result

    service = PromoService()
    found = asyncio.run(service.validate_promo_code("MATRIXABC123", db))
    assert found is promo


def test_use_promo_code_marks_used_and_commits(monkeypatch):
    from app.services.promo_service import PromoService
    from app.models.quest import PromoCode

    promo = PromoCode(code="MATRIXABC123", user_id=1, discount_type="MATRIX", discount_value=30)
    promo.used_at = None

    service = PromoService()
    monkeypatch.setattr(service, "validate_promo_code", AsyncMock(return_value=promo))

    db = AsyncMock()

    ok = asyncio.run(service.use_promo_code("MATRIXABC123", db))
    assert ok is True
    assert promo.used_at is not None
    assert db.commit.await_count == 1


def test_use_promo_code_returns_false_when_invalid(monkeypatch):
    from app.services.promo_service import PromoService

    service = PromoService()
    monkeypatch.setattr(service, "validate_promo_code", AsyncMock(return_value=None))

    db = AsyncMock()

    ok = asyncio.run(service.use_promo_code("INVALID", db))
    assert ok is False
    assert db.commit.await_count == 0

