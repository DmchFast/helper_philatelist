import json
import logging
import time
from pathlib import Path
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text
from app.core.database import engine, Base
from app.db.models import Role, CatalogStamp
from app.routers import auth, users, catalog, albums, public, categories


logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("api_logger")


def _load_catalog_seed() -> list[dict]:
    seed_path = Path(__file__).resolve().parent.parent / "catalog_seed.json"
    with seed_path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


async def _sync_catalog_seed(conn):
    catalog_seed = _load_catalog_seed()
    existing_result = await conn.execute(select(CatalogStamp.__table__))
    existing_rows = existing_result.mappings().all()
    existing_by_id = {row["id"]: row for row in existing_rows}

    rows_to_insert = []
    rows_to_update = []

    for stamp in catalog_seed:
        stamp_id = int(stamp["id"])
        values = {
            "name_code": stamp["title"],
            "country": stamp["country"],
            "year_issued": int(stamp["year"]),
            "nominal_value": None,
            "catalog_price": None,
            "circulation": None,
            "perforation": None,
            "theme_series": stamp["series"],
            "features": None,
            "image_url": stamp["image"],
        }
        current = existing_by_id.get(stamp_id)
        if current is None:
            rows_to_insert.append({"id": stamp_id, **values})
            continue

        current_values = {
            "name_code": current["name_code"],
            "country": current["country"],
            "year_issued": current["year_issued"],
            "nominal_value": current["nominal_value"],
            "catalog_price": float(current["catalog_price"]) if current["catalog_price"] is not None else None,
            "circulation": current["circulation"],
            "perforation": current["perforation"],
            "theme_series": current["theme_series"],
            "features": current["features"],
            "image_url": current["image_url"],
        }
        if current_values != values:
            rows_to_update.append((stamp_id, values))

    if rows_to_insert:
        await conn.execute(CatalogStamp.__table__.insert(), rows_to_insert)

    for stamp_id, values in rows_to_update:
        await conn.execute(
            CatalogStamp.__table__.update().where(CatalogStamp.id == stamp_id).values(**values)
        )

    # Seed uses explicit IDs, so Postgres sequence must be aligned to MAX(id)
    # to avoid duplicate key errors on subsequent inserts without explicit ID.
    if conn.dialect.name == "postgresql":
        await conn.execute(
            text(
                """
                SELECT setval(
                    pg_get_serial_sequence('catalog_stamps', 'id'),
                    COALESCE((SELECT MAX(id) FROM catalog_stamps), 1),
                    true
                )
                """
            )
        )


async def _sync_collection_stamp_schema(conn):
    if conn.dialect.name != "postgresql":
        return

    await conn.execute(text("ALTER TABLE collection_stamps ALTER COLUMN catalog_stamp_id DROP NOT NULL"))
    await conn.execute(text("ALTER TABLE collection_stamps ADD COLUMN IF NOT EXISTS title VARCHAR"))
    await conn.execute(text("ALTER TABLE collection_stamps ADD COLUMN IF NOT EXISTS series VARCHAR"))
    await conn.execute(text("ALTER TABLE collection_stamps ADD COLUMN IF NOT EXISTS year_issued INTEGER"))
    await conn.execute(text("ALTER TABLE collection_stamps ADD COLUMN IF NOT EXISTS country VARCHAR"))
    await conn.execute(text("ALTER TABLE collection_stamps ADD COLUMN IF NOT EXISTS image_url VARCHAR"))


async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time

    client_host = request.client.host if request.client else "unknown"
    logger.info(
        "IP: %s | Method: %s | URL: %s | Status: %s | Duration: %.4fs",
        client_host,
        request.method,
        request.url.path,
        response.status_code,
        process_time,
    )

    return response


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        await _sync_collection_stamp_schema(conn)
        result = await conn.execute(select(Role))
        if not result.scalars().first():
            await conn.execute(
                Role.__table__.insert().values([{"role_name": "user"}, {"role_name": "admin"}])
            )
        await _sync_catalog_seed(conn)
    yield


app = FastAPI(title="Philatelist Handbook API", lifespan=lifespan)

app.middleware("http")(log_requests)

# CORS для фронтенда (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(users.public_router)
app.include_router(catalog.router)
app.include_router(albums.router)
app.include_router(public.router)
app.include_router(categories.router)