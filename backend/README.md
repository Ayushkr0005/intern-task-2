# Backend (Express + MongoDB)

## Setup

```bash
npm i
```

Copy `.env.example` to `.env` and set:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN` (default `http://localhost:5173`)

## Run

```bash
npm run dev
```

## Seed

```bash
npm run seed
```

## Tests

```bash
npm test
```

## API endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `POST /api/auth/logout`

### Courses

- `GET /api/courses` (supports `category`, `difficulty`, `price`, `search` query params)
- `GET /api/courses/:id` (accepts Mongo `_id` or `slug`)
- `POST /api/courses` (admin)
- `PUT /api/courses/:id` (admin)
- `DELETE /api/courses/:id` (admin)

### Enrollments

- `POST /api/enroll` (alias) / `POST /api/enrollments` (protected)
- `GET /api/enrollments/me` (protected)
- `PUT /api/enrollments/:id/progress` (protected)

### Admin

- `GET /api/users` (admin)
