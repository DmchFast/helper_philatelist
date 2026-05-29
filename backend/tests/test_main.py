from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_app_title():
    assert app.title == "Philatelist Handbook API"

def test_cors_headers():
    response = client.options(
        "/auth/login",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"

def test_router_inclusion():
    # проверяем, что все роутеры зарегистрированы (по префиксам)
    routes = [route.path for route in app.routes]
    assert "/auth/login" in routes
    assert "/albums/" in routes
    assert "/catalog/stamps" in routes
    assert "/public/albums" in routes
    assert "/users/" in routes
    assert "/categories/" in routes