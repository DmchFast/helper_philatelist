from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.db.models import Album, CollectionStamp, CatalogStamp, User, UserProfile
from app.db.schemas import PublicAlbumOut, CollectionStampOut, CatalogStampOut
from typing import List

router = APIRouter(prefix="/public", tags=["public"])

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
            cat = await cs.awaitable_attrs.catalog_stamp
            stamps_out.append(CollectionStampOut(
                id=cs.id,
                catalog_stamp=CatalogStampOut.model_validate(cat, from_attributes=True),
                purchase_price=cs.purchase_price,
                purchase_date=cs.purchase_date,
                condition_status=cs.condition_status,
                custom_notes=cs.custom_notes
            ))
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