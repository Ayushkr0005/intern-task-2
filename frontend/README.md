# Frontend (React + Vite)

UI for the E-Learning platform.

## Setup

```bash
npm i
```

## Run

```bash
npm run dev
```

App runs on:

- `http://localhost:5173`

## Environment variables

By default, the app calls the backend at `http://localhost:4000`.

To override, create a `.env` file in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

## Routes

- `/` Landing
- `/courses` Course listing + filters
- `/courses/:slug` Course detail + enroll
- `/login`, `/signup`
- `/dashboard` (protected)
- `/admin` (admin-only)

## Notes

- Auth uses an **httpOnly cookie**. Frontend requests include cookies via `credentials: 'include'`.

## Tests

```bash
npm test -- --run
```
