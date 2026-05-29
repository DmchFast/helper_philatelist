import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, Mock
from app.main import app
from app.core.dependencies import get_db, get_current_admin_user, get_current_user
from app.db.models import CatalogStamp

mock_admin = Mock()
mock_admin.id = 1
mock_admin.role = "admin"
async def override_get_current_admin():
    return mock_admin
async def override_get_current_user():
    return None

app.dependency_overrides[get_current_admin_user] = override_get_current_admin
app.dependency_overrides[get_current_user] = override_get_current_user

client = TestClient(app)

def test_list_catalog_stamps_empty():
    mock_result = Mock()
    mock_result.scalars.return_value.all.return_value = []

    mock_session = AsyncMock()
    mock_session.execute = AsyncMock(return_value=mock_result)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.get("/catalog/stamps")
    assert response.status_code == 200
    assert response.json() == []

def test_list_catalog_stamps_with_search():
    stamp = CatalogStamp(id=1, name_code="Test Stamp", country="Russia")
    mock_result = Mock()
    mock_result.scalars.return_value.all.return_value = [stamp]

    mock_session = AsyncMock()
    mock_session.execute = AsyncMock(return_value=mock_result)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.get("/catalog/stamps?search=Test")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name_code"] == "Test Stamp"

def test_create_catalog_stamp_admin():
    mock_session = AsyncMock()
    mock_session.add = Mock()
    mock_session.commit = AsyncMock()
    async def refresh_mock(obj):
        obj.id = 1
    mock_session.refresh = refresh_mock

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.post("/catalog/stamps", json={
        "name_code": "New Stamp",
        "country": "USA"
    })
    assert response.status_code == 200
    assert response.json()["name_code"] == "New Stamp"
    assert response.json()["id"] == 1

def test_update_catalog_stamp_not_found():
    mock_session = AsyncMock()
    mock_session.get = AsyncMock(return_value=None)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.put("/catalog/stamps/999", json={"name_code": "Updated"})
    assert response.status_code == 404

def test_delete_catalog_stamp():
    mock_stamp = CatalogStamp(id=1, name_code="ToDelete")
    mock_session = AsyncMock()
    mock_session.get = AsyncMock(return_value=mock_stamp)
    mock_session.delete = AsyncMock()
    mock_session.commit = AsyncMock()

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.delete("/catalog/stamps/1")
    assert response.status_code == 200
    assert response.json()["message"] == "Stamp deleted"