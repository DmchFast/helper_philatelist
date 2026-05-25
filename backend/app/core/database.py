from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession, AsyncAttrs
from sqlalchemy.orm import declarative_base
from app.core.config import settings

engine = create_async_engine(settings.database_url, echo=False) #Логи подключения к бд и существования таблиц
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base(cls=AsyncAttrs)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session