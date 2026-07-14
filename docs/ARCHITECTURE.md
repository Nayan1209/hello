# Architecture

## Backend (`apps/api`)

- Plain Node HTTP server with modular route registration.
- Shared in-memory store for MVP behavior and testing.
- Modules:
  - `auth`: registration/login/session lookup
  - `profile`: profile write/read
  - `match`: candidate filtering and swipe/match logic
  - `chat`: conversation for matched users
  - `safety`: block/report/admin moderation

## Auth model

- Login returns a bearer token.
- Protected endpoints require `Authorization: Bearer <token>`.
- Admin-only endpoint: `GET /admin/reports`.

## Future direction

- Replace in-memory store with PostgreSQL + Prisma.
- Add worker queues for notifications and moderation tasks.
- Add mobile client integration.
