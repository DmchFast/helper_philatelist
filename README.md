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