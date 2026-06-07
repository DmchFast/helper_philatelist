import json
import asyncio
import logging
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models import CatalogStamp

logger = logging.getLogger("catalog_seed")

SEED_PATH = Path(__file__).resolve().parents[2] / "catalog_seed.json"


def load_catalog_seed() -> list[dict]:
    """Загрузка"""
    with SEED_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def _catalog_stamp_to_seed_row(stamp: CatalogStamp) -> dict:
    return {
        "id": str(stamp.id),
        "title": stamp.name_code,
        "series": stamp.theme_series,
        "year": str(stamp.year_issued) if stamp.year_issued is not None else None,
        "country": stamp.country,
        "image": stamp.image_url or None,
    }


async def persist_catalog_seed(db: AsyncSession) -> None:
    """
    Сохраняет текущее состояние каталога марок в JSON-файл.
    Вызывается после каждого изменения (создание, обновление, удаление).
    """
    try:
        # Все марки из БД, отсортированные по ID
        result = await db.execute(select(CatalogStamp).order_by(CatalogStamp.id))
        stamps = result.scalars().all()
        payload = [_catalog_stamp_to_seed_row(stamp) for stamp in stamps]
        def _write_file():
            with SEED_PATH.open("w", encoding="utf-8") as handle:
                json.dump(payload, handle, ensure_ascii=False, indent=2)
                handle.write("\n")
            logger.info(f"Catalog seed successfully written to {SEED_PATH}")

        await asyncio.to_thread(_write_file)

    except Exception as e:
        logger.error(f"Failed to persist catalog seed: {e}")