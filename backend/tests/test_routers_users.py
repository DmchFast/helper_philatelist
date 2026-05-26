import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, Mock
from app.main import app
from app.core.dependencies import get_db, get_current_active_user, get_current_admin_user
from datetime import datetime, timezone

class MockUser:
    def __init__(self, id, email, created_at):
        self.id = id
        self.email = email
        self.created_at = created_at

mock_user = MockUser(id=1, email="user@test.com", created_at=datetime.now(timezone.utc))

async def override_get_current_active():
    return mock_user

async def override_get_current_admin():
    return mock_user

app.dependency_overrides[get_current_active_user] = override_get_current_active
app.dependency_overrides[get_current_admin_user] = override_get_current_admin

client = TestClient(app)

def test_list_users_empty():
    mock_result = Mock()
    mock_result.scalars.return_value.all.return_value = []

    mock_session = AsyncMock()
    mock_session.execute = AsyncMock(return_value=mock_result)
    mock_session.scalar = AsyncMock(return_value=0)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.get("/users/")
    assert response.status_code == 200
    assert response.json() == []

def test_admin_get_all_users():
    mock_result = Mock()
    mock_result.scalars.return_value.all.return_value = []

    mock_session = AsyncMock()
    mock_session.execute = AsyncMock(return_value=mock_result)
    mock_session.scalar = AsyncMock(return_value=0)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.get("/admin/users/")
    assert response.status_code == 200
    assert response.json() == []

def test_admin_change_user_role_invalid():
    mock_result = Mock()
    mock_result.scalar_one_or_none.return_value = None

    mock_session = AsyncMock()
    mock_session.execute = AsyncMock(return_value=mock_result)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.put("/admin/users/1/role", json={"role": "superadmin"})
    assert response.status_code == 400

def test_admin_delete_user():
    mock_user_to_delete = Mock()
    mock_user_to_delete.id = 10

    mock_session = AsyncMock()
    mock_session.get = AsyncMock(return_value=mock_user_to_delete)
    mock_session.delete = AsyncMock()
    mock_session.commit = AsyncMock()

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.delete("/admin/users/10")
    assert response.status_code == 200
    assert response.json()["message"] == "User deleted"