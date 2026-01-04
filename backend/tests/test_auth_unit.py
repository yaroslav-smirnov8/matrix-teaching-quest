from fastapi.security import HTTPBasicCredentials
from fastapi import HTTPException
import pytest


def test_verify_admin_accepts_correct_credentials(monkeypatch):
    from app.core import auth

    monkeypatch.setattr(auth, "ADMIN_USERNAME", "admin_user", raising=False)
    monkeypatch.setattr(auth, "ADMIN_PASSWORD", "admin_pass", raising=False)

    username = auth.verify_admin(HTTPBasicCredentials(username="admin_user", password="admin_pass"))
    assert username == "admin_user"


def test_verify_admin_rejects_incorrect_password(monkeypatch):
    from app.core import auth

    monkeypatch.setattr(auth, "ADMIN_USERNAME", "admin_user", raising=False)
    monkeypatch.setattr(auth, "ADMIN_PASSWORD", "admin_pass", raising=False)

    with pytest.raises(HTTPException) as exc:
        auth.verify_admin(HTTPBasicCredentials(username="admin_user", password="wrong"))

    assert exc.value.status_code == 401
