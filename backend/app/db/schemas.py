from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date, datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str

class UserOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    created_at: datetime
    albums_count: int = 0
    stamps_count: int = 0

class ProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    city: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None

class ProfileOut(BaseModel):
    user_id: int
    first_name: Optional[str]
    last_name: Optional[str]
    country: Optional[str]
    city: Optional[str]
    bio: Optional[str]
    avatar_url: Optional[str]
    updated_at: Optional[datetime]

class UserWithProfile(UserOut):
    profile: Optional[ProfileOut]

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryOut(CategoryBase):
    id: int

class AlbumCreate(BaseModel):
    title: str
    category_id: Optional[int] = None
    description: Optional[str] = None
    is_public: bool = True

class AlbumUpdate(BaseModel):
    title: Optional[str] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    is_public: Optional[bool] = None

class AlbumOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    is_public: bool
    created_at: datetime
    owner_id: int
    owner_name: Optional[str] = None
    stamps_count: int = 0

class CatalogStampCreate(BaseModel):
    name_code: str
    country: Optional[str] = None
    year_issued: Optional[int] = None
    nominal_value: Optional[str] = None
    catalog_price: Optional[float] = None
    circulation: Optional[str] = None
    perforation: Optional[str] = None
    theme_series: Optional[str] = None
    features: Optional[str] = None
    image_url: Optional[str] = None

class CatalogStampUpdate(CatalogStampCreate):
    pass

class CatalogStampOut(CatalogStampCreate):
    id: int

class CollectionStampCreate(BaseModel):
    catalog_stamp_id: Optional[int] = None
    title: Optional[str] = None
    series: Optional[str] = None
    year_issued: Optional[int] = None
    country: Optional[str] = None
    image_url: Optional[str] = None
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    condition_status: Optional[str] = None
    custom_notes: Optional[str] = None

class CollectionStampUpdate(BaseModel):
    catalog_stamp_id: Optional[int] = None
    title: Optional[str] = None
    series: Optional[str] = None
    year_issued: Optional[int] = None
    country: Optional[str] = None
    image_url: Optional[str] = None
    purchase_price: Optional[float] = None
    purchase_date: Optional[date] = None
    condition_status: Optional[str] = None
    custom_notes: Optional[str] = None

class CollectionStampOut(BaseModel):
    id: int
    catalog_stamp: Optional[CatalogStampOut] = None
    catalog_stamp_id: Optional[int] = None
    title: Optional[str] = None
    series: Optional[str] = None
    year_issued: Optional[int] = None
    country: Optional[str] = None
    image_url: Optional[str] = None
    purchase_price: Optional[float]
    purchase_date: Optional[date]
    condition_status: Optional[str]
    custom_notes: Optional[str]

class PublicAlbumOut(AlbumOut):
    stamps: List[CollectionStampOut] = []

class UserRoleUpdate(BaseModel):
    role: str

class UserForAdmin(BaseModel):
    id: int
    email: str
    role: str
    first_name: Optional[str]
    last_name: Optional[str]
    country: Optional[str]
    albums_count: int
    stamps_count: int

class UserListOut(BaseModel):
    id: int
    email: EmailStr
    role: str
    roleLabel: str
    name: str
    avatar: str
    albumsCount: int
    stampsCount: int
    city: Optional[str]
    country: Optional[str]
    joinedAt: int
    bio: Optional[str]