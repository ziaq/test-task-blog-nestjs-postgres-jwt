## Тестовое задание🛡️ Backend API — NestJS + PostgreSQL + JWT

> ℹ️ Полное техническое задание доступно в корне проекта в файле  
> **Техническое задание.pdf**

**Тестовое задание** "Backend API блога" для работы с профилем пользователя и его постами, написанный на NestJS с использованием PostgreSQL и TypeORM.  
Проект реализует:
- Аутентификацию по JWT (access + refresh)
- Fingerprint-защиту refresh-токенов
- Хранение изображений в файловой системе
- Контейнеризацию через Docker Compose

### 🌐 Связанный фронтенд
Фронтенд для этого тестового задания доступен по ссылке:  
👉 [https://github.com/ziaq/test-task-blog-react-shadcn](https://github.com/ziaq/test-task-blog-react-shadcn)

---

### 🛠️ Технологии

- **NestJS** — основной backend-фреймворк
- **PostgreSQL** — база данных
- **TypeORM** — ORM
- **JWT** — аутентификация
- **Multer** — загрузка изображений
- **Zod** — валидация входных данных
- **Docker / Docker Compose** — контейнеризация приложения и базы данных

---

## 🔧 Функционал API

### 🛡️ Аутентификация
- `POST /auth/register` — регистрация нового пользователя  
  Требуется в теле запроса JSON-ом:  
  Обязательные поля:
  - `email` — email пользователя  
  - `password` — пароль (минимум 6 символов)  
  - `firstName` — имя  
  - `lastName` — фамилия  

  Необязательные поля:
  - `phone` — номер телефона  
  - `birthDate` — дата рождения в формате `YYYY-MM-DD`  
  - `about` — краткая информация о себе

- `POST /auth/login` — вход пользователя, возвращает `accessToken` и устаналивает `refreshToken` в cookie  
Требуется в теле запроса JSON-ом:
  - `email` — email пользователя  
  - `password` — пароль  
  - `fingerprint` — уникальный идентификатор устройства  

- `POST /auth/refresh` — возвращает новый `accessToken`  
   	Требуется:
  - Не истекший `refreshToken` в cookie  
  - Fingerprint в теле запроса JSON-ом

### 👤 Управление профилем
> 🔐 Везде требуется авторизация (`accessToken` в заголовке Authorization: `Bearer ...`)
- `GET /profile` — получение данных профиля текущего пользователя
- `PATCH /profile` — обновление данных профиля  
  Требуется в теле запроса JSON-ом:  
  Обязательные поля:
  - `email` — email пользователя  
  - `password` — пароль (минимум 6 символов)  
  - `firstName` — имя  
  - `lastName` — фамилия  

  Необязательные поля:
  - `phone` — номер телефона  
  - `birthDate` — дата рождения в формате `YYYY-MM-DD`  
  - `about` — краткая информация о себе
- `PATCH /profile/avatar` — загрузка аватара пользователя (multipart/form-data)

### 📝 Управление постами (CRUD)
> 🔐 Везде требуется авторизация (`accessToken` в заголовке Authorization: `Bearer ...`)
- `GET /posts` — получение списка постов  
  Параметры:
  - `limit` — ограничение количества
  - `offset` — смещение
  - `sort` — сортировка по дате (`asc` / `desc`)

- `POST /posts` — создание поста (текст + изображения)
- `PATCH /posts/:id` — обновление текста и/или изображений
- `DELETE /posts/:id` — удаление поста

---

## 🚀 Быстрый старт

### 1. Клонировать репозиторий

```bash
git clone https://github.com/your-org/nest-auth-api.git
cd nest-auth-api
```
### 2. Создать .env файл
В корне проекта создай файл .env со следующим содержимым:
```env
NODE_ENV=development
SERVER_IP=127.0.0.1
SERVER_PORT=3001

POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5242
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=postgres

JWT_ACCESS_SECRET=secret_access_token_key_123!@#
JWT_REFRESH_SECRET=even_more_secret_refresh_token_key_456!@#
```
### 3. Запустить проект через Docker Compose
```bash
docker-compose up --build
```
Это поднимет:

- API сервер на localhost:3001

- Базу данных PostgreSQL на порту 5242