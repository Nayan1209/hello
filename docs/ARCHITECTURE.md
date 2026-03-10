# Architecture

## Current starter implementation

- `apps/api`: runnable Node HTTP API with modular route files.
- `apps/web`: frontend placeholder package.
- `packages/*`: reserved for shared UI/config as the project grows.

## API modules

- `auth`: register and login stubs.
- `profile`: create/get user profiles.
- `match`: candidate listing and swipe-to-match flow.
- `chat`: chat restricted to matched users.

## Data storage

Current implementation uses in-memory storage in `apps/api/src/store.js`.
Next step is migrating to PostgreSQL + Prisma.
