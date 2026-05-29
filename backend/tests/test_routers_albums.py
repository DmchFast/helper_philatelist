import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, Mock
from app.main import app
from app.core.dependencies import get_db, get_current_active_user
from app.db.models import Album
from datetime import datetime, timezone

class MockUser:
    def __init__(self, id, email):
        self.id = id
        self.email = email
        self.awaitable_attrs = Mock()
        mock_role = Mock()
        mock_role.role_name = "user"
        self.awaitable_attrs.role = AsyncMock(return_value=mock_role)
        self.awaitable_attrs.profile = AsyncMock(return_value=None)

mock_user = MockUser(id=1, email="a@b.com")
mock_album = Album(id=10, user_id=1, title="My Album", description="Desc", is_public=True)

async def override_get_current_active_user():
    return mock_user

app.dependency_overrides[get_current_active_user] = override_get_current_active_user
client = TestClient(app)

def test_list_my_albums_empty():
    mock_result = Mock()
    mock_result.scalars.return_value.all.return_value = []

    mock_session = AsyncMock()
    mock_session.execute = AsyncMock(return_value=mock_result)
    mock_session.scalar = AsyncMock(return_value=0)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.get("/albums/")
    assert response.status_code == 200
    assert response.json() == []

def test_create_album():
    mock_session = AsyncMock()
    mock_session.add = Mock()
    mock_session.commit = AsyncMock()
    async def refresh_mock(obj):
        obj.id = 1
        obj.created_at = datetime.now(timezone.utc)
    mock_session.refresh = refresh_mock

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.post("/albums/", json={
        "title": "New Album",
        "description": "Test",
        "is_public": True
    })
    assert response.status_code == 200
    assert response.json()["title"] == "New Album"
    assert response.json()["id"] == 1

def test_update_album_not_found():
    mock_session = AsyncMock()
    mock_session.get = AsyncMock(return_value=None)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.put("/albums/999", json={"title": "Updated"})
    assert response.status_code == 404

def test_delete_album():
    mock_session = AsyncMock()
    mock_session.get = AsyncMock(return_value=mock_album)
    mock_session.delete = AsyncMock()
    mock_session.commit = AsyncMock()

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.delete("/albums/10")
    assert response.status_code == 200
    assert response.json()["message"] == "Album deleted"

def test_get_album_stamps():
    mock_result = Mock()
    mock_result.scalars.return_value.all.return_value = []

    mock_session = AsyncMock()
    mock_album.user_id = 1
    mock_session.get = AsyncMock(return_value=mock_album)
    mock_session.execute = AsyncMock(return_value=mock_result)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.get("/albums/10/stamps")
    assert response.status_code == 200
    assert response.json() == []

def test_add_stamp_to_album_catalog_not_found():
    mock_session = AsyncMock()
    mock_album.user_id = 1
    mock_session.get = AsyncMock(side_effect=[mock_album, None])
    mock_session.add = Mock()
    mock_session.commit = AsyncMock()
    mock_session.refresh = AsyncMock()

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.post("/albums/10/stamps", json={
        "catalog_stamp_id": 5,
        "purchase_price": 100.0
    })
    assert response.status_code == 404