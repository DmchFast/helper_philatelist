from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from app.core.database import get_db
from app.db.models import User, Role, UserProfile, Album, CollectionStamp
from app.db.schemas import UserForAdmin, UserRoleUpdate, UserListOut
from app.core.dependencies import get_current_admin_user, get_current_active_user

router = APIRouter(prefix="/admin/users", tags=["admin"])
public_router = APIRouter(prefix="/users", tags=["users"])

def build_role_label(role_name: str) -> str:
    return "АДМИНИСТРАТОР" if role_name == "admin" else "КОЛЛЕКЦИОНЕР"

def build_display_name(profile: Optional[UserProfile], email: str) -> str:
    if profile and (profile.first_name or profile.last_name):
        return f"{profile.first_name or ''} {profile.last_name or ''}".strip()
    return email

def build_avatar(profile: Optional[UserProfile], display_name: str) -> str:
    if profile and profile.avatar_url:
        return profile.avatar_url
    return (display_name[:1] or "?").upper()

@public_router.get("/", response_model=list[UserListOut])
async def list_users(
    search: str = Query(None),
    role: str = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_active_user)
):
    query = select(User)
    if role and role != "Все роли":
        role_obj = await db.execute(select(Role).where(Role.role_name == role))
        role_row = role_obj.scalar_one_or_none()
        if role_row:
            query = query.where(User.role_id == role_row.id)
    if search:
        profile_subq = select(UserProfile.user_id).where(
            or_(
                UserProfile.first_name.ilike(f"%{search}%"),
                UserProfile.last_name.ilike(f"%{search}%")
            )
        )
        query = query.where(
            or_(
                User.email.ilike(f"%{search}%"),
                User.id.in_(profile_subq)
            )
        )
    result = await db.execute(query)
    users = result.scalars().all()
    out = []
    for u in users:
        role_res = await u.awaitable_attrs.role
        profile = await u.awaitable_attrs.profile
        albums_count = await db.scalar(select(func.count(Album.id)).where(Album.user_id == u.id))
        stamps_count = await db.scalar(
            select(func.count(CollectionStamp.id))
            .join(Album, CollectionStamp.album_id == Album.id)
            .where(Album.user_id == u.id)
        )
        display_name = build_display_name(profile, u.email)
        out.append(UserListOut(
            id=u.id,
            email=u.email,
            role=role_res.role_name,
            roleLabel=build_role_label(role_res.role_name),
            name=display_name,
            avatar=build_avatar(profile, display_name),
            albumsCount=albums_count or 0,
            stampsCount=stamps_count or 0,
            city=profile.city if profile else None,
            country=profile.country if profile else None,
            joinedAt=u.created_at.year,
            bio=profile.bio if profile else None
        ))
    return out

@router.get("/", response_model=list[UserForAdmin])
async def get_all_users(
    search: str = Query(None),
    role: str = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin_user)
):
    query = select(User)
    if role and role != "Все роли":
        role_obj = await db.execute(select(Role).where(Role.role_name == role))
        role_id = role_obj.scalar_one_or_none()
        if role_id:
            query = query.where(User.role_id == role_id.id)
    if search:
        profile_subq = select(UserProfile.user_id).where(
            or_(
                UserProfile.first_name.ilike(f"%{search}%"),
                UserProfile.last_name.ilike(f"%{search}%")
            )
        )
        query = query.where(
            or_(
                User.email.ilike(f"%{search}%"),
                User.id.in_(profile_subq)
            )
        )
    result = await db.execute(query)
    users = result.scalars().all()
    out = []
    for u in users:
        role_res = await u.awaitable_attrs.role
        profile = await u.awaitable_attrs.profile
        albums_count = await db.scalar(select(func.count(Album.id)).where(Album.user_id == u.id))
        stamps_count = await db.scalar(
            select(func.count(CollectionStamp.id))
            .join(Album, CollectionStamp.album_id == Album.id)
            .where(Album.user_id == u.id)
        )
        out.append(UserForAdmin(
            id=u.id,
            email=u.email,
            role=role_res.role_name,
            first_name=profile.first_name if profile else None,
            last_name=profile.last_name if profile else None,
            country=profile.country if profile else None,
            albums_count=albums_count or 0,
            stamps_count=stamps_count or 0
        ))
    return out

@router.put("/{user_id}/role")
async def change_user_role(
    user_id: int,
    role_update: UserRoleUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin_user)
):
    role_obj = await db.execute(select(Role).where(Role.role_name == role_update.role))
    role = role_obj.scalar_one_or_none()
    if not role:
        raise HTTPException(400, "Invalid role")
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    user.role_id = role.id
    await db.commit()
    return {"message": "Role updated"}

@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin_user)
):
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(404, "User not found")
    await db.delete(user)
    await db.commit()
    return {"message": "User deleted"}