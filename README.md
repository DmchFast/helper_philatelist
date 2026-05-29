# Справочник филателиста 🎴

## Backend

[![Python](https://img.shields.io/badge/3.10+-3776AB?style=for-the-badge&logo=python&logoColor=FFD43B&label=Python&labelColor=303030)]()
[![FastAPI](https://img.shields.io/badge/0.115.6-009688?style=for-the-badge&logo=fastapi&logoColor=009688&label=FastAPI&labelColor=303030)]()
[![SQLAlchemy](https://img.shields.io/badge/2.0.36-CC0000?style=for-the-badge&logo=sqlalchemy&logoColor=CC0000&label=SQLAlchemy&labelColor=303030)]()
[![PostgreSQL](https://img.shields.io/badge/AsyncPG-336791?style=for-the-badge&logo=postgresql&logoColor=336791&label=PostgreSQL&labelColor=303030)]()
[![Pydantic](https://img.shields.io/badge/2.10.4-E92063?style=for-the-badge&logo=pydantic&logoColor=E92063&label=Pydantic&labelColor=303030)]()
[![Pytest](https://img.shields.io/badge/7.0+-0A9EDC?style=for-the-badge&logo=pytest&logoColor=0A9EDC&label=Pytest&labelColor=303030)]()

Бэкенд проекта — это RESTful API на FastAPI. Приложение управляет каталогом марок, авторизацией пользователей, их личными коллекциями и публичными альбомами.

### Как устроен API

Сервер запускается на `http://127.0.0.1:7000` и предоставляет набор маршрутов для работы с данными:

**Основные маршруты:**

- `/auth` — авторизация и регистрация пользователей. Поддерживает JWT-токены для сессии.
- `/catalog` — глобальный каталог марок. Можно получать список марок, фильтровать и сортировать.
- `/albums` — управление личными альбомами пользователя (создание, редактирование, удаление, добавление марок).
- `/collection` — публичные альбомы сообщества. Показывает альбомы, помеченные как общедоступные.
- `/users` — список пользователей системы с поиском и фильтрацией.
- `/categories` — справочные данные (страны, годы, темы).

### Синхронизация данных

При запуске бэкенда автоматически:

1. Создаёт таблицы БД (если их нет).
2. Загружает каталог марок из `catalog_seed.json`.
3. Создаёт стандартные роли (`user` и `admin`).
4. Выравнивает PostgreSQL-последовательность, чтобы избежать ошибок при вставке.

### Аутентификация и авторизация

Используется JWT-токен в заголовке `Authorization: Bearer <token>`. Система поддерживает две роли:

- `user` — стандартный пользователь (может создавать альбомы, добавлять марки).
- `admin` — администратор (полный доступ ко всем ресурсам).

Защищённые маршруты проверяют валидность токена и роль пользователя перед обработкой запроса.

### Логирование и мониторинг

Все входящие HTTP-запросы логируются: IP адрес, метод, путь, код ответа и время обработки. Это помогает отследить проблемы и проанализировать нагрузку на API.

### Запуск бэкенда

```bash
cd backend
.venv\Scripts\activate
pip install -e .
python run.py
```

### Команды для тестирования

```bash
cd backend
pytest                                       # запуск тестов базовый
pytest tests/ -q --maxfail=1 -p no:warnings  # запуск тестов без предупреждений
pytest tests/ -q --cov=app --cov-report=term # запуск тестов с покрытием
```

API будет доступен по адресу: **http://127.0.0.1:7000**  
Интерактивная документация Swagger: **http://127.0.0.1:7000/docs**