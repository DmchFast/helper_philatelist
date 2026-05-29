# Справочник филателиста 🎴

## Frontend
[![HTML5](https://img.shields.io/badge/HTML5-E34C26?style=for-the-badge&logo=html5&logoColor=E34C26&label=HTML&labelColor=303030)]()
[![CSS3](https://img.shields.io/badge/CSS3-264DE4?style=for-the-badge&logo=css&logoColor=264DE4&label=CSS&labelColor=303030)]()
[![JavaScript](https://img.shields.io/badge/ES6+-F7DF1E?style=for-the-badge&logo=javascript&label=JavaScript&labelColor=303030)]()
[![Nodejs](https://img.shields.io/badge/24.13.1-3C873A?style=for-the-badge&logo=node.js&label=Node.js&labelColor=303030&logoColor=3C873A)]()
[![React](https://img.shields.io/badge/19.2.5-61DAFB?style=for-the-badge&logo=react&logoColor=61DAFB&label=React&labelColor=303030)]()
[![React Router](https://img.shields.io/badge/7.15.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=CA4245&label=React%20Router&labelColor=303030)]()
[![Vite](https://img.shields.io/badge/8.0.10-646CFF?style=for-the-badge&logo=vite&logoColor=646CFF&label=Vite&labelColor=303030)]()
[![Ant Design](https://img.shields.io/badge/6.3.7-1677FF?style=for-the-badge&logo=antdesign&logoColor=1677FF&label=Ant%20Design&labelColor=303030)]()
[![Vitest](https://img.shields.io/badge/4.1.7-6E9F18?style=for-the-badge&logo=vitest&logoColor=6E9F18&label=Vitest&labelColor=303030)]()
[![Testing Library](https://img.shields.io/badge/16.3.2-E33332?style=for-the-badge&logo=testinglibrary&logoColor=E33332&label=Testing%20Library&labelColor=303030)]()


Фронтенд проекта — это SPA на React, собранное через Vite и оформленное на Ant Design. Приложение помогает работать с марками: смотреть марки, собирать личные альбомы, открывать публичные альбомы и просматривать пользователей системы.

### Как устроен интерфейс

После запуска приложение открывается на маршруте `/catalog`. Навигация выполнена через левый сайдбар, а верхняя панель используется для поиска по текущему разделу.

Основные разделы фронтенда:

- `/catalog` — каталог марок. Здесь можно искать марки, фильтровать их по стране и году, сортировать список и добавлять марку в свой альбом.
- `/collection` — публичные альбомы. Показывает общедоступные альбомы из общей базы и альбомы пользователей, если у них включена публичность.
- `/my-collection` — личная коллекция. Раздел доступен только после авторизации. В нём можно создавать альбомы, редактировать их, скрывать или показывать публичность и управлять марками внутри альбома.
- `/users` — список пользователей системы с поиском и фильтром по роли.
- `/admin` — административный раздел, доступный только пользователю с ролью `admin`.

### Запуск фронтенда

```bash
cd frontend
npm install
npm run dev
```

### Команды для тестирования

```bash
cd frontend
npm run dev           # запуск в режиме разработки
npx vitest            # запуск тестов через Vitest
npx vitest --watch    # Vitest в режиме наблюдения
npx vitest --coverage # запуск тестов с покрытием
```

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