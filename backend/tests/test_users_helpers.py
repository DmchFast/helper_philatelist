from types import SimpleNamespace

from app.routers import users as users_router


def test_build_role_label():
    assert users_router.build_role_label("admin") == "АДМИНИСТРАТОР"
    assert users_router.build_role_label("user") == "КОЛЛЕКЦИОНЕР"


def test_build_display_name_with_profile():
    profile = SimpleNamespace(first_name="Ivan", last_name="Petrov")
    assert users_router.build_display_name(profile, "a@b.com") == "Ivan Petrov"


def test_build_display_name_falls_back_to_email():
    profile = SimpleNamespace(first_name=None, last_name=None)
    assert users_router.build_display_name(profile, "a@b.com") == "a@b.com"


def test_build_display_name_with_partial_profile():
    profile = SimpleNamespace(first_name="Ivan", last_name=None)
    assert users_router.build_display_name(profile, "a@b.com") == "Ivan"

    profile = SimpleNamespace(first_name=None, last_name="Petrov")
    assert users_router.build_display_name(profile, "a@b.com") == "Petrov"


def test_build_avatar_prefers_avatar_url():
    profile = SimpleNamespace(avatar_url="http://example.com/a.png")
    assert users_router.build_avatar(profile, "Name") == "http://example.com/a.png"


def test_build_avatar_uses_initial():
    profile = SimpleNamespace(avatar_url=None)
    assert users_router.build_avatar(profile, "Name") == "N"
    assert users_router.build_avatar(profile, "") == "?"
