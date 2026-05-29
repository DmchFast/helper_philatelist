from datetime import datetime, timezone
from app.db import schemas

def test_user_register_defaults():
    model = schemas.UserRegister(email="a@b.com", password="secret")
    assert model.first_name is None
    assert model.last_name is None

def test_album_update_exclude_unset():
    model = schemas.AlbumUpdate(title="New")
    dumped = model.model_dump(exclude_unset=True)
    assert dumped == {"title": "New"}

def test_catalog_stamp_create_defaults():
    model = schemas.CatalogStampCreate(name_code="AA-1")
    assert model.country is None
    assert model.year_issued is None
    assert model.catalog_price is None

def test_collection_stamp_update_defaults():
    model = schemas.CollectionStampUpdate()
    dumped = model.model_dump(exclude_unset=True)
    assert dumped == {}

def test_profile_update_exclude_unset():
    model = schemas.ProfileUpdate(city="Moscow")
    dumped = model.model_dump(exclude_unset=True)
    assert dumped == {"city": "Moscow"}

def test_public_album_out_accepts_stamps():
    stamp = schemas.CollectionStampOut(
        id=1,
        catalog_stamp=schemas.CatalogStampOut(
            id=5,
            name_code="A",
            country=None,
            year_issued=None,
            nominal_value=None,
            catalog_price=None,
            circulation=None,
            perforation=None,
            theme_series=None,
            features=None,
            image_url=None,
        ),
        purchase_price=None,
        purchase_date=None,
        condition_status=None,
        custom_notes=None,
    )
    album = schemas.PublicAlbumOut(
        id=1,
        title="Test",
        description=None,
        is_public=True,
        created_at=datetime.now(timezone.utc),
        owner_id=1,
        owner_name=None,
        stamps_count=1,
        stamps=[stamp],
    )
    assert album.stamps[0].id == 1
    assert album.stamps[0].catalog_stamp.id == 5