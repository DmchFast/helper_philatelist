import pytest
from fastapi import HTTPException
from app.core import auth
from app.core.dependencies import (
    get_current_active_user,
    get_current_admin_user,
    get_current_user,
)

class DummyResult:
    def __init__(self, user):
        self._user = user
    def scalar_one_or_none(self):
        return self._user

class DummySession:
    def __init__(self, user):
        self._user = user
    async def execute(self, *_args, **_kwargs):
        return DummyResult(self._user)

class DummyAwaitableAttrs:
    def __init__(self, role):
        self._role = role
    @property
    def role(self):
        async def _get_role():
            return self._role
        return _get_role()

class DummyUser:
    def __init__(self, role_name):
        self.awaitable_attrs = DummyAwaitableAttrs(DummyRole(role_name))

class DummyRole:
    def __init__(self, role_name):
        self.role_name = role_name

@pytest.mark.asyncio
async def test_get_current_user_returns_none_without_token():
    user = await get_current_user(token=None, db=DummySession(user=None))
    assert user is None

@pytest.mark.asyncio
async def test_get_current_user_rejects_bad_token():
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(token="bad", db=DummySession(user=None))
    assert exc_info.value.status_code == 401

@pytest.mark.asyncio
async def test_get_current_user_rejects_non_int_sub():
    token = auth.create_access_token({"sub": "abc"})
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(token=token, db=DummySession(user=None))
    assert exc_info.value.status_code == 401

@pytest.mark.asyncio
async def test_get_current_user_returns_user():
    token = auth.create_access_token({"sub": "1"})
    dummy = object()
    user = await get_current_user(token=token, db=DummySession(user=dummy))
    assert user is dummy

@pytest.mark.asyncio
async def test_get_current_user_missing_user_raises():
    token = auth.create_access_token({"sub": "1"})
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(token=token, db=DummySession(user=None))
    assert exc_info.value.status_code == 401

@pytest.mark.asyncio
async def test_get_current_active_user_requires_auth():
    with pytest.raises(HTTPException) as exc_info:
        await get_current_active_user(current_user=None)
    assert exc_info.value.status_code == 401

@pytest.mark.asyncio
async def test_get_current_admin_user_requires_admin():
    user = DummyUser(role_name="user")
    with pytest.raises(HTTPException) as exc_info:
        await get_current_admin_user(current_user=user)
    assert exc_info.value.status_code == 403

@pytest.mark.asyncio
async def test_get_current_admin_user_allows_admin():
    user = DummyUser(role_name="admin")
    result = await get_current_admin_user(current_user=user)
    assert result is user