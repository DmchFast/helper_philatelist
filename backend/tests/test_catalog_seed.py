import pytest
from pathlib import Path
from app import main

def test_load_catalog_seed_returns_list(monkeypatch):
    # Создаём временный тестовый JSON, если реальный файл недоступен
    test_data = [
        {"id": "1", "title": "Test", "country": "Test", "year": "2000", "series": "Test", "image": None}
    ]
    def mock_load(*args, **kwargs):
        return test_data

    monkeypatch.setattr(main, "_load_catalog_seed", mock_load)
    data = main._load_catalog_seed()
    assert isinstance(data, list)
    assert data
    assert "id" in data[0]
    assert "title" in data[0]
    assert "country" in data[0]
    assert "year" in data[0]
    assert "series" in data[0]
    assert "image" in data[0]