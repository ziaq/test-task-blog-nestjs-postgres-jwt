## Тестовое задание🛡️ Backend API — NestJS + PostgreSQL + JWT

> ℹ️ Полное техническое задание доступно в корне проекта в файле  
> **Техническое задание.pdf**

**Тестовое задание** "Backend API блога" для работы с профилем пользователя и его постами, написанный на NestJS с использованием PostgreSQL и TypeORM.  
Проект реализует:
- Rest api Auth, Posts, Users
- Аутентификацию по JWT (access + refresh)
- Fingerprint-защиту refresh-токенов
- Хранение изображений в файловой системе
- Хранение данных в БД Postgres
- Валидация входящих данных схемами zod
- Валидация расширений изборажений по File Magic Numbers
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

- `POST /auth/logout` — выход пользователя, удаляет refreshToken из базы и очищает cookie  
    Требуется:
  - Не истекший `refreshToken` в cookie  
  - Fingerprint в теле запроса JSON-ом

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
- `POST /profile/avatar` — загрузка аватара пользователя  
  Требуется отправить `multipart/form-data` с файлом в поле с именем `file`  
  Поддерживаемые форматы: `jpg`, `jpeg`, `png`  
  Максимальный размер файла: 5MB

### 📝 Управление постами
> 🔐 Везде требуется авторизация (`accessToken` в заголовке Authorization: `Bearer ...`)
- `GET /posts` — получение списка постов юзера
  Параметры запроса:
  - `limit` — ограничение количества
  - `offset` — смещение
  - `sort` — сортировка по дате (`asc` / `desc`)

- `POST /posts` — создание нового поста  
  Отправлять как `multipart/form-data`.

  Обязательные поля:
  - `text` — текст поста (максимум 10 000 символов)

  Необязательные поля:
  - до 10 изображений, прикрепляемых в отдельных полях с имменем `file`  
  Поддерживаемые форматы: `jpg`, `jpeg`, `png`  
  Максимальный размер каждого изображения: 5MB

- `PATCH /posts/:id` — обновление существующего поста  
  Требуется передать параметр `id` в URL.  
  Отправлять как `multipart/form-data`.

  Обязательные поля:
  - `text` — новый текст поста (максимум 10 000 символов)

  Необязательные поля:
  	- Поле `deleteImageIds` — массив `id` изображений, которые нужно удалить.  
  	Пример: `deleteImageIds: [23, 56, 79]`  
    - до 10 изображений, прикрепляемых в отдельных полях с именем `file`  
    Поддерживаемые форматы: `jpg`, `jpeg`, `png`  
    Максимальный размер каждого изображения: 5MB

- `DELETE /posts/:id` — удаление поста  
  Требуется передать параметр `id` в URL.


---

## 🚀 Запуск проекта

### 1. Клонировать репозиторий

```bash
git clone https://github.com/your-org/nest-auth-api.git
cd nest-auth-api
```
### 2. Создать .env файл
В корне проекта создай файл .env со следующим содержимым:
```env
NODE_ENV=development
SERVER_IP=0.0.0.0
SERVER_PORT=3001
CLIENT_IP=localhost
CLIENT_PORT=5171

POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=123456
POSTGRES_DB=postgres

JWT_ACCESS_SECRET=secret_access_token_key_123!@#
JWT_REFRESH_SECRET=even_more_secret_refresh_token_key_456!@#
```
### 3. Запустить проект через docker-compose
В терминале перейди в корень проекта и выполни команды:
1. Собрать образы
```bash
docker-compose build
```
2. Запустить проект
```bash
docker-compose up -d
```

Это поднимет:

- ✅ **API-сервер NestJS** — доступен по адресу: [`http://localhost:3001`](http://localhost:3001)
- ✅ **PostgreSQL** — база данных будет доступна локально по адресу:  
  `localhost:5432`  
ℹ️ Логин, пароль, имя базы, а также другие настройки берутся из файла `.env`