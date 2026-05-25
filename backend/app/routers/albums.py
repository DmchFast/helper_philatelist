from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.db.models import Album, CollectionStamp, CatalogStamp
from app.db.schemas import (
    AlbumCreate, AlbumUpdate, AlbumOut,
    CollectionStampOut, CollectionStampCreate, CollectionStampUpdate,
    CatalogStampOut
)
from app.core.dependencies import get_current_active_user

router = APIRouter(prefix="/albums", tags=["albums"])

@router.get("/", response_model=list[AlbumOut])
async def list_my_albums(
    current_user=Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Album).where(Album.user_id == current_user.id))
    albums = result.scalars().all()
    out = []
    for a in albums:
        stamps_count = await db.scalar(select(func.count(CollectionStamp.id)).where(CollectionStamp.album_id == a.id))
        out.append(AlbumOut(
            id=a.id,
            title=a.title,
            description=a.description,
            is_public=a.is_public,
            created_at=a.created_at,
            owner_id=current_user.id,
            owner_name=None,
            stamps_count=stamps_count or 0
        ))
    return out

@router.post("/", response_model=AlbumOut)
async def create_album(
    album_data: AlbumCreate,
    current_user=Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    new_album = Album(
        user_id=current_user.id,
        title=album_data.title,
        description=album_data.description,
        category_id=album_data.category_id,
        is_public=album_data.is_public
    )
    db.add(new_album)
    await db.commit()
    await db.refresh(new_album)
    return AlbumOut(
        id=new_album.id,
        title=new_album.title,
        description=new_album.description,
        is_public=new_album.is_public,
        created_at=new_album.created_at,
        owner_id=current_user.id,
        stamps_count=0
    )

@router.put("/{album_id}", response_model=AlbumOut)
async def update_album(
    album_id: int,
    album_data: AlbumUpdate,
    current_user=Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    album = await db.get(Album, album_id)
    if not album or album.user_id != current_user.id:
        raise HTTPException(404, "Album not found")
    for key, value in album_data.model_dump(exclude_unset=True).items():
        setattr(album, key, value)
    await db.commit()
    await db.refresh(album)
    stamps_count = await db.scalar(select(func.count(CollectionStamp.id)).where(CollectionStamp.album_id == album.id))
    return AlbumOut(
        id=album.id,
        title=album.title,
        description=album.description,
        is_public=album.is_public,
        created_at=album.created_at,
        owner_id=current_user.id,
        stamps_count=stamps_count or 0
    )

@router.delete("/{album_id}")
async def delete_album(
    album_id: int,
    current_user=Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    album = await db.get(Album, album_id)
    if not album or album.user_id != current_user.id:
        raise HTTPException(404, "Album not found")
    await db.delete(album)
    await db.commit()
    return {"message": "Album deleted"}

@router.get("/{album_id}/stamps", response_model=list[CollectionStampOut])
async def get_album_stamps(
    album_id: int,
    current_user=Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    album = await db.get(Album, album_id)
    if not album or album.user_id != current_user.id:
        raise HTTPException(404, "Album not found")
    result = await db.execute(
        select(CollectionStamp).where(CollectionStamp.album_id == album_id)
    )
    stamps = result.scalars().all()
    out = []
    for cs in stamps:
        cat = await db.get(CatalogStamp, cs.catalog_stamp_id)
        if not cat:
            continue
        out.append(CollectionStampOut(
            id=cs.id,
            catalog_stamp=CatalogStampOut.model_validate(cat, from_attributes=True),
            purchase_price=cs.purchase_price,
            purchase_date=cs.purchase_date,
            condition_status=cs.condition_status,
            custom_notes=cs.custom_notes
        ))
    return out

@router.post("/{album_id}/stamps", response_model=CollectionStampOut)
async def add_stamp_to_album(
    album_id: int,
    stamp_data: CollectionStampCreate,
    current_user=Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    album = await db.get(Album, album_id)
    if not album or album.user_id != current_user.id:
        raise HTTPException(404, "Album not found")
    new_stamp = CollectionStamp(
        album_id=album_id,
        catalog_stamp_id=stamp_data.catalog_stamp_id,
        purchase_price=stamp_data.purchase_price,
        purchase_date=stamp_data.purchase_date,
        condition_status=stamp_data.condition_status,
        custom_notes=stamp_data.custom_notes
    )
    db.add(new_stamp)
    await db.commit()
    await db.refresh(new_stamp)
    catalog_stamp = await db.get(CatalogStamp, new_stamp.catalog_stamp_id)
    if not catalog_stamp:
        raise HTTPException(404, "Catalog stamp not found")
    return CollectionStampOut(
        id=new_stamp.id,
        catalog_stamp=CatalogStampOut.model_validate(catalog_stamp, from_attributes=True),
        purchase_price=new_stamp.purchase_price,
        purchase_date=new_stamp.purchase_date,
        condition_status=new_stamp.condition_status,
        custom_notes=new_stamp.custom_notes
    )

@router.put("/{album_id}/stamps/{stamp_id}")
async def update_collection_stamp(
    album_id: int,
    stamp_id: int,
    update_data: CollectionStampUpdate,
    current_user=Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    album = await db.get(Album, album_id)
    if not album or album.user_id != current_user.id:
        raise HTTPException(404, "Album not found")
    stamp = await db.get(CollectionStamp, stamp_id)
    if not stamp or stamp.album_id != album_id:
        raise HTTPException(404, "Stamp not found")
    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(stamp, key, value)
    await db.commit()
    return {"message": "Stamp updated"}

@router.delete("/{album_id}/stamps/{stamp_id}")
async def delete_collection_stamp(
    album_id: int,
    stamp_id: int,
    current_user=Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    album = await db.get(Album, album_id)
    if not album or album.user_id != current_user.id:
        raise HTTPException(404, "Album not found")
    stamp = await db.get(CollectionStamp, stamp_id)
    if not stamp or stamp.album_id != album_id:
        raise HTTPException(404, "Stamp not found")
    await db.delete(stamp)
    await db.commit()
    return {"message": "Stamp deleted"}