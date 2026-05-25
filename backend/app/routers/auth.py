from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.core.database import get_db
from app.db.models import User, Role, UserProfile, Album, CollectionStamp
from app.db.schemas import UserLogin, UserRegister, Token, UserOut, ProfileUpdate, ProfileOut
from app.core.auth import verify_password, get_password_hash, create_access_token
from app.core.dependencies import get_current_active_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == user_data.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")
    role_result = await db.execute(select(Role).where(Role.role_name == "user"))
    user_role = role_result.scalar_one()
    hashed = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed,
        role_id=user_role.id
    )
    db.add(new_user)
    await db.flush()
    profile = UserProfile(
        user_id=new_user.id,
        first_name=user_data.first_name,
        last_name=user_data.last_name
    )
    db.add(profile)
    await db.commit()
    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == credentials.email))
    user = result.scalar_one_or_none()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserOut)
async def get_me(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    role_result = await current_user.awaitable_attrs.role
    albums_count = await db.scalar(select(func.count(Album.id)).where(Album.user_id == current_user.id))
    stamps_count = await db.scalar(
        select(func.count(CollectionStamp.id))
        .join(Album, CollectionStamp.album_id == Album.id)
        .where(Album.user_id == current_user.id)
    )
    return UserOut(
        id=current_user.id,
        email=current_user.email,
        role=role_result.role_name,
        created_at=current_user.created_at,
        albums_count=albums_count or 0,
        stamps_count=stamps_count or 0
    )

@router.get("/profile", response_model=ProfileOut)
async def get_profile(current_user: User = Depends(get_current_active_user), db: AsyncSession = Depends(get_db)):
    profile = await current_user.awaitable_attrs.profile
    return ProfileOut(
        user_id=current_user.id,
        first_name=profile.first_name,
        last_name=profile.last_name,
        country=profile.country,
        city=profile.city,
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        updated_at=profile.updated_at
    )

@router.put("/profile", response_model=ProfileOut)
async def update_profile(
    update: ProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    profile = await current_user.awaitable_attrs.profile
    if update.first_name is not None:
        profile.first_name = update.first_name
    if update.last_name is not None:
        profile.last_name = update.last_name
    if update.country is not None:
        profile.country = update.country
    if update.city is not None:
        profile.city = update.city
    if update.bio is not None:
        profile.bio = update.bio
    if update.avatar_url is not None:
        profile.avatar_url = update.avatar_url
    await db.commit()
    await db.refresh(profile)
    return ProfileOut(
        user_id=current_user.id,
        first_name=profile.first_name,
        last_name=profile.last_name,
        country=profile.country,
        city=profile.city,
        bio=profile.bio,
        avatar_url=profile.avatar_url,
        updated_at=profile.updated_at
    )