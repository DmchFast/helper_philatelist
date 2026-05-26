from app.core.auth import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from datetime import timedelta
import pytest
from jose import jwt

def test_password_hash_different_each_time():
    pwd = "secret"
    h1 = get_password_hash(pwd)
    h2 = get_password_hash(pwd)
    assert h1 != h2

def test_verify_password_correct():
    pwd = "mypass"
    hashed = get_password_hash(pwd)
    assert verify_password(pwd, hashed)

def test_verify_password_incorrect():
    pwd = "mypass"
    hashed = get_password_hash(pwd)
    assert not verify_password("wrong", hashed)

def test_create_token_with_expires_delta():
    token = create_access_token({"sub": "123"}, expires_delta=timedelta(seconds=1))
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    assert payload["sub"] == "123"

def test_create_token_without_expires_delta_uses_default():
    token = create_access_token({"sub": "456"})
    payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    assert payload["sub"] == "456"
    assert "exp" in payload