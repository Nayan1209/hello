# Samajh Match App (MVP Backend + Mobile Plan)

This repository contains a runnable backend MVP for a matchmaking app and a mobile app starter plan.

## What is implemented now

- Auth with token sessions (`register`, `login`, `me`)
- Profile management
- Candidate discovery with filters
- Swipe-based matching
- Matched-user chat
- Safety tools (`block`, `report`)
- Admin moderation endpoint (`/admin/reports`)

## Project structure

```text
apps/
  api/      # Runnable Node API
  web/      # Web placeholder
  mobile/   # Mobile publishing guide + starter notes
docs/
  PLAYSTORE_PUBLISHING.md
```

## Run backend

```bash
npm install
npm run start:api
```

API default URL: `http://localhost:4000`

## Test backend

```bash
npm run test
```

## Key endpoints

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `POST /profile`
- `GET /profile/:userId`
- `GET /match/candidates?location=&minAge=&maxAge=`
- `POST /match/swipe`
- `GET /match/list`
- `POST /chat/send`
- `GET /chat/thread?withUserId=`
- `POST /safety/block`
- `POST /safety/report`
- `GET /admin/reports`

For complete cloud setup, API testing, deployment, and Play Store steps, read `docs/COMPLETE_SETUP_AND_LAUNCH_GUIDE.md` and `docs/PLAYSTORE_PUBLISHING.md`.
