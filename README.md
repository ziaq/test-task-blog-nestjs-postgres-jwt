## Тестовое задание️ REST API — NestJS + PostgreSQL + JWT

REST API блога для работы с профилем пользователя и его постами, написанный на NestJS с использованием PostgreSQL и TypeORM.

Включает в себя:  

- REST API для Аутентификации, Постов, Профиля
- OpenAPI-документация с использованием zod-to-openapi
- Валидация данных через Zod
- Аутентификация по JWT (access + refresh)
- Fingerprint-защита refresh-токенов
- Получение изображений из multipart/form-data
- Хранение изображений в файловой системе
- Валидация расширений изборажений по File Magic Numbers
- Хранение данных в БД Postgres
- Контейнеризация через Docker, Docker Compose

NestJS, PostgreSQL, TypeORM, JWT, Zod, Multer, swagger-ui-express, zod-to-openapi, Docker, Docker Compose

## API

#### Документация доступна в двух вариантах:

1. Swagger UI: доступнен по url `OPENAPI_URL>/api` (Настраивается в `.env`)
2. Файл OpenAPI: `docs/openapi.yaml`

#### Получение изображений

- `GET /uploads/avatar/:filename` — получение аватара  
  Параметр url `filename` — имя файла (например: avatar.jpg)
- `GET /uploads/post-images/:filename` — получение изображения к посту  
  Параметр url `filename` — имя файла (например: image1.jpg)

## Запуск проекта

1. Клонировать репозиторий
```
git clone https://github.com/ziaq/test-task-blog-nestjs-postgres-jwt
```
2. Перейти в директорию проекта
```
cd nest-auth-api
```
3. Создать `.env` файл в корне проекта, скопирвать туда:

```env
NODE_ENV=development
SERVER_IP=0.0.0.0
SERVER_PORT=3001
OPENAPI_URL=http://localhost:3001
CLIENT_URL=http://localhost:5171

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=postgres

JWT_ACCESS_SECRET=secret_access_token_key_123!@#
JWT_REFRESH_SECRET=even_more_secret_refresh_token_key_456!@#
```
4. Запустить через docker-compose
```bash
docker-compose build
```
```bash
docker-compose up -d
```

Это поднимет:

- API-сервер NestJS,  доступен по адресу: [`http://localhost:3001`](http://localhost:3001)
- Интерактивный Swagger UI [`http://localhost:3001/api`](http://localhost:3001/api)
- PostgreSQL — база данных

Настройки берутся из файла `.env`