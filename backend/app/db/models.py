from sqlalchemy import (
    Column, Integer, String, Boolean, Text, ForeignKey, DateTime, Numeric, Date
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    role_name = Column(String, nullable=False)  # 'admin', 'user'

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    role = relationship("Role")
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    albums = relationship("Album", back_populates="owner", cascade="all, delete-orphan")

class UserProfile(Base):
    __tablename__ = "user_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    country = Column(String)
    city = Column(String)
    bio = Column(Text)
    avatar_url = Column(String)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", back_populates="profile")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)

class Album(Base):
    __tablename__ = "albums"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    is_public = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="albums")
    category = relationship("Category")
    collection_stamps = relationship("CollectionStamp", back_populates="album", cascade="all, delete-orphan")

class CatalogStamp(Base):
    __tablename__ = "catalog_stamps"
    id = Column(Integer, primary_key=True)
    name_code = Column(String, nullable=False)
    country = Column(String)
    year_issued = Column(Integer)
    nominal_value = Column(String)
    catalog_price = Column(Numeric(10,2))
    circulation = Column(String)
    perforation = Column(String)
    theme_series = Column(String)
    features = Column(Text)
    image_url = Column(String)

class CollectionStamp(Base):
    __tablename__ = "collection_stamps"
    id = Column(Integer, primary_key=True)
    album_id = Column(Integer, ForeignKey("albums.id"), nullable=False)
    catalog_stamp_id = Column(Integer, ForeignKey("catalog_stamps.id"), nullable=True)
    title = Column(String)
    series = Column(String)
    year_issued = Column(Integer)
    country = Column(String)
    image_url = Column(String)
    purchase_price = Column(Numeric(10,2))
    purchase_date = Column(Date)
    condition_status = Column(String)  # 'Гашеная', 'Чистая', 'С дефектом'
    custom_notes = Column(Text)

    album = relationship("Album", back_populates="collection_stamps")
    catalog_stamp = relationship("CatalogStamp")