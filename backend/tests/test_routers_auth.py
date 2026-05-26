import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, Mock, patch
from app.main import app
from app.core.dependencies import get_db, get_current_user
from datetime import datetime, timezone

class MockUser:
    def __init__(self, id, email, password_hash, role_id):
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.role_id = role_id
        self.created_at = datetime.now(timezone.utc)

mock_user = MockUser(id=1, email="test@example.com", password_hash="hashed", role_id=1)

async def override_get_db():
    # Создаём сессию, где методы add и flush – обычные Mock (не AsyncMock)
    mock_session = AsyncMock()
    mock_session.add = Mock()          # синхронный метод
    mock_session.flush = AsyncMock()   # это асинхронный метод
    mock_session.refresh = AsyncMock()
    mock_session.commit = AsyncMock()
    yield mock_session

async def override_get_current_user():
    return mock_user

app.dependency_overrides[get_db] = override_get_db
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

def test_register_success():
    with patch("app.routers.auth.get_password_hash", return_value="hashed"):
        with patch("app.routers.auth.create_access_token", return_value="token123"):
            mock_result = Mock()
            mock_result.scalar_one_or_none.return_value = None

            mock_session = AsyncMock()
            mock_session.execute = AsyncMock(return_value=mock_result)
            mock_session.add = Mock()          # синхронный
            mock_session.flush = AsyncMock()
            mock_session.commit = AsyncMock()

            async def override_get_db():
                yield mock_session
            app.dependency_overrides[get_db] = override_get_db

            response = client.post("/auth/register", json={
                "email": "new@example.com",
                "password": "secret",
                "first_name": "John",
                "last_name": "Doe"
            })
            assert response.status_code == 200
            assert response.json()["access_token"] == "token123"

def test_register_email_exists():
    with patch("app.routers.auth.get_password_hash", return_value="hashed"):
        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = mock_user

        mock_session = AsyncMock()
        mock_session.execute = AsyncMock(return_value=mock_result)
        mock_session.add = Mock()
        mock_session.flush = AsyncMock()
        mock_session.commit = AsyncMock()

        async def override_get_db():
            yield mock_session
        app.dependency_overrides[get_db] = override_get_db

        response = client.post("/auth/register", json={
            "email": "existing@example.com",
            "password": "secret"
        })
        assert response.status_code == 400
        assert response.json()["detail"] == "Email already registered"

def test_login_success():
    with patch("app.routers.auth.verify_password", return_value=True):
        with patch("app.routers.auth.create_access_token", return_value="login_token"):
            mock_result = Mock()
            mock_result.scalar_one_or_none.return_value = mock_user

            mock_session = AsyncMock()
            mock_session.execute = AsyncMock(return_value=mock_result)

            async def override_get_db():
                yield mock_session
            app.dependency_overrides[get_db] = override_get_db

            response = client.post("/auth/login", json={
                "email": "test@example.com",
                "password": "correct"
            })
            assert response.status_code == 200
            assert response.json()["access_token"] == "login_token"

def test_login_wrong_password():
    with patch("app.routers.auth.verify_password", return_value=False):
        mock_result = Mock()
        mock_result.scalar_one_or_none.return_value = mock_user

        mock_session = AsyncMock()
        mock_session.execute = AsyncMock(return_value=mock_result)

        async def override_get_db():
            yield mock_session
        app.dependency_overrides[get_db] = override_get_db

        response = client.post("/auth/login", json={
            "email": "test@example.com",
            "password": "wrong"
        })
        assert response.status_code == 401
        assert "Incorrect email or password" in response.json()["detail"]