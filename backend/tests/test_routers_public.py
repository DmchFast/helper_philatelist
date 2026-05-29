import pytest
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, Mock
from app.main import app
from app.core.dependencies import get_db

client = TestClient(app)

def test_list_public_albums_empty():
    mock_result = Mock()
    mock_result.scalars.return_value.all.return_value = []

    mock_session = AsyncMock()
    mock_session.execute = AsyncMock(return_value=mock_result)

    async def override_get_db():
        yield mock_session
    app.dependency_overrides[get_db] = override_get_db

    response = client.get("/public/albums")
    assert response.status_code == 200
    assert response.json() == []