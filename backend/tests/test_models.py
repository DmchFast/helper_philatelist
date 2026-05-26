from app.db.models import Role, User, UserProfile, Category, Album, CatalogStamp, CollectionStamp

def test_role_creation():
    role = Role(id=1, role_name="admin")
    assert role.role_name == "admin"

def test_user_creation():
    user = User(id=1, email="test@example.com", password_hash="hash", role_id=1)
    assert user.email == "test@example.com"

def test_user_profile_relation():
    profile = UserProfile(user_id=1, first_name="John")
    assert profile.first_name == "John"
    assert profile.user_id == 1

def test_album_public_default_true():
    album = Album(title="Test", is_public=True)
    assert album.is_public is True

def test_catalog_stamp_fields():
    stamp = CatalogStamp(name_code="US-2020", country="USA", year_issued=2020)
    assert stamp.name_code == "US-2020"
    assert stamp.year_issued == 2020

def test_collection_stamp_condition():
    cs = CollectionStamp(album_id=1, catalog_stamp_id=1, condition_status="Чистая")
    assert cs.condition_status == "Чистая"