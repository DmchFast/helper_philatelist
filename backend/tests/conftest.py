import os
import pytest
import warnings

# Подавляем DeprecationWarning от библиотеки python-jose
warnings.filterwarnings("ignore", category=DeprecationWarning, module="jose")

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost/test_philatelist")
os.environ.setdefault("SECRET_KEY", "test-secret")
os.environ.setdefault("ALGORITHM", "HS256")
os.environ.setdefault("ACCESS_TOKEN_EXPIRE_MINUTES", "30")

@pytest.fixture(scope="session")
def event_loop():
    """Создаёт новый event loop для каждой сессии тестов."""
    import asyncio
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()