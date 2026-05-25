from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.db.models import CatalogStamp, User
from app.db.schemas import CatalogStampCreate, CatalogStampUpdate, CatalogStampOut
from app.core.dependencies import get_current_admin_user, get_current_user

router = APIRouter(prefix="/catalog", tags=["catalog"])

@router.get("/stamps", response_model=list[CatalogStampOut])
async def list_catalog_stamps(
    search: str = Query(None),
    country: str = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)  # optional auth
):
    query = select(CatalogStamp)
    if search:
        query = query.where(CatalogStamp.name_code.ilike(f"%{search}%"))
    if country and country != "Все страны":
        query = query.where(CatalogStamp.country == country)
    result = await db.execute(query)
    stamps = result.scalars().all()
    return stamps

@router.post("/stamps", response_model=CatalogStampOut)
async def create_catalog_stamp(
    stamp: CatalogStampCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin_user)
):
    new_stamp = CatalogStamp(**stamp.model_dump())
    db.add(new_stamp)
    await db.commit()
    await db.refresh(new_stamp)
    return new_stamp

@router.put("/stamps/{stamp_id}", response_model=CatalogStampOut)
async def update_catalog_stamp(
    stamp_id: int,
    stamp_data: CatalogStampUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin_user)
):
    stamp = await db.get(CatalogStamp, stamp_id)
    if not stamp:
        raise HTTPException(404, "Stamp not found")
    for key, value in stamp_data.model_dump(exclude_unset=True).items():
        setattr(stamp, key, value)
    await db.commit()
    await db.refresh(stamp)
    return stamp

@router.delete("/stamps/{stamp_id}")
async def delete_catalog_stamp(
    stamp_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin_user)
):
    stamp = await db.get(CatalogStamp, stamp_id)
    if not stamp:
        raise HTTPException(404, "Stamp not found")
    await db.delete(stamp)
    await db.commit()
    return {"message": "Stamp deleted"}