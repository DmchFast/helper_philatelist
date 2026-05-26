from datetime import datetime, timedelta, timezone

from jose import jwt

from app.core import auth


def test_password_hash_and_verify():
    password = "p@ssw0rd"
    hashed = auth.get_password_hash(password)

    assert hashed != password
    assert auth.verify_password(password, hashed)
    assert not auth.verify_password("bad", hashed)


def test_create_access_token_includes_sub_and_exp():
    token = auth.create_access_token({"sub": "123"})
    payload = jwt.decode(
        token,
        auth.settings.secret_key,
        algorithms=[auth.settings.algorithm],
    )

    assert payload["sub"] == "123"
    assert "exp" in payload


def test_create_access_token_uses_custom_expiration():
    delta = timedelta(minutes=5)
    now = datetime.now(timezone.utc)
    token = auth.create_access_token({"sub": "1"}, expires_delta=delta)
    payload = jwt.decode(
        token,
        auth.settings.secret_key,
        algorithms=[auth.settings.algorithm],
    )
    exp = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)

    assert exp >= now + delta - timedelta(seconds=5)
    assert exp <= now + delta + timedelta(seconds=5)
