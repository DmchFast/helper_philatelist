from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.db.models import Album, CollectionStamp, CatalogStamp, User, UserProfile
from app.db.schemas import PublicAlbumOut, CollectionStampOut, CatalogStampOut
from typing import List

router = APIRouter(prefix="/public", tags=["public"])


def build_collection_stamp_out(collection_stamp: CollectionStamp, catalog_stamp: CatalogStamp | None):
    return CollectionStampOut(
        id=collection_stamp.id,
        catalog_stamp=CatalogStampOut.model_validate(catalog_stamp, from_attributes=True) if catalog_stamp else None,
        catalog_stamp_id=collection_stamp.catalog_stamp_id,
        title=collection_stamp.title or (catalog_stamp.name_code if catalog_stamp else None),
        series=collection_stamp.series or (catalog_stamp.theme_series if catalog_stamp else None),
        year_issued=collection_stamp.year_issued or (catalog_stamp.year_issued if catalog_stamp else None),
        country=collection_stamp.country or (catalog_stamp.country if catalog_stamp else None),
        image_url=collection_stamp.image_url or (catalog_stamp.image_url if catalog_stamp else None),
        purchase_price=collection_stamp.purchase_price,
        purchase_date=collection_stamp.purchase_date,
        condition_status=collection_stamp.condition_status,
        custom_notes=collection_stamp.custom_notes,
    )

@router.get("/albums", response_model=list[PublicAlbumOut])
async def list_public_albums(
    search: str = Query(None),
    author: str = Query(None),
    theme: str = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(Album).where(Album.is_public == True)
    if search:
        query = query.where(Album.title.ilike(f"%{search}%"))
    if author and author != "Все авторы":
        user_ids = await db.execute(
            select(User.id).join(UserProfile).where(
                func.concat(UserProfile.first_name, ' ', UserProfile.last_name).ilike(f"%{author}%")
            )
        )
        ids = [row[0] for row in user_ids.all()]
        if ids:
            query = query.where(Album.user_id.in_(ids))
        else:
            return []
    if theme and theme != "Все темы":
        query = query.where(Album.category.has(name=theme))
    result = await db.execute(query)
    albums = result.scalars().all()
    out = []
    for a in albums:
        owner = await a.awaitable_attrs.owner
        profile = await owner.awaitable_attrs.profile
        owner_name = f"{profile.first_name or ''} {profile.last_name or ''}".strip() or owner.email
        stamps_result = await db.execute(
            select(CollectionStamp).where(CollectionStamp.album_id == a.id)
        )
        stamps = stamps_result.scalars().all()
        stamps_out = []
        for cs in stamps:
            cat = await cs.awaitable_attrs.catalog_stamp if cs.catalog_stamp_id else None
            stamps_out.append(build_collection_stamp_out(cs, cat))
        out.append(PublicAlbumOut(
            id=a.id,
            title=a.title,
            description=a.description,
            is_public=True,
            created_at=a.created_at,
            owner_id=owner.id,
            owner_name=owner_name,
            stamps_count=len(stamps),
            stamps=stamps_out
        ))
    return out