# UniHub — React + FastAPI

Frontend проекта переведён на React + Vite. Существующий FastAPI backend не переписывается.

## Запуск всего проекта

Требуется Docker и Docker Compose.

```bash
docker compose up --build
```

После запуска открыть:

```text
http://localhost
```

Frontend работает на порту `80`.

FastAPI остаётся доступен на `8000` для разработки и Swagger:

```text
http://localhost:8000/docs
```

## Как работает JWT

1. React отправляет `POST /login`.
2. FastAPI возвращает `access_token`.
3. React сохраняет токен в `localStorage`.
4. Каждый защищённый запрос получает заголовок:

```text
Authorization: Bearer <token>
```

5. Nginx передаёт этот заголовок FastAPI.

## Что подключено

- `/login`
- `/register`
- `/timetable`
- `/ecourses`
- `/usport`
- `/papers`
- `/uniinfo`
- `/aboutus`

Последние шесть маршрутов сейчас остаются backend-заглушками. React показывает их реальный JSON-ответ, поэтому их можно заменить полноценной реализацией backend позже без переделки авторизации.

## Структура frontend

```text
frontend/
├── src/
│   ├── main.jsx
│   └── styles.css
├── nginx/
│   └── default.conf
├── Dockerfile
├── index.html
├── package.json
└── vite.config.js
```

## Локальная разработка без Docker

В папке `frontend`:

```bash
npm install
npm run dev
```

Vite проксирует API-запросы на `http://localhost:8000`.


### Переходы внешних сервисов

Для `/timetable`, `/ecourses`, `/usport`, `/papers`, `/uniinfo` и `/aboutus` frontend не показывает ответ API. Backend должен вернуть URL внешнего сервиса в поле `detail`, например:

```json
{"detail": "https://example.com/service"}
```

После нажатия на сервис React автоматически перенаправит браузер на этот URL. Поэтому для настройки ссылок достаточно заменить значения `detail` в соответствующих FastAPI-эндпоинтах.
