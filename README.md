# E-Learning Platform (MERN)

Monorepo with:

- `backend/` Node.js + Express + MongoDB (JWT auth via httpOnly cookie)
- `frontend/` React (Vite) + React Router + Tailwind CSS

## Prerequisites

- Node.js
- MongoDB running locally

## Quick start

### 1) Backend

```bash
cd backend
npm i
```

Create `.env` (already created in this workspace) or copy from `.env.example`.

Start API:

```bash
npm run dev
```

API runs on:

- `http://localhost:4000`

### 2) Seed sample data (admin user + sample courses)

```bash
cd backend
npm run seed
```

Default admin credentials:

- Email: `admin@example.com`
- Password: `admin12345`

(Optional) override in `backend/.env`:

```env
SEED_ADMIN_EMAIL=admin@yourapp.com
SEED_ADMIN_PASSWORD=yourStrongPassword
SEED_ADMIN_NAME=Admin
```

### 3) Frontend

```bash
cd frontend
npm i
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

## App routes

- `/` Landing
- `/courses` Course listing + filters
- `/courses/:slug` Course detail + enroll
- `/login`, `/signup`
- `/dashboard` (protected)
- `/admin` (admin-only)

## Running tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test -- --run
```

## Notes

- Auth uses a JWT stored in an **httpOnly cookie** (`accessToken`).
- Frontend API calls are made with `credentials: 'include'`.
