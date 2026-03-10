# Samajh Match App (Starter)

This repository now includes a runnable backend starter for a community matchmaking app, with separate modules for:

- Auth
- Profile
- Match
- Chat

## Project Structure

```text
apps/
  api/
    src/
      modules/
        auth/
        profile/
        match/
        chat/
  web/
docs/
packages/
```

## Run the app

```bash
npm install
npm run start:api
```

API starts on `http://localhost:4000`.

## Useful commands

```bash
npm run dev:api
npm run test
```

## Current API

- `GET /health`
- `POST /auth/register`
- `POST /auth/login`
- `POST /profile`
- `GET /profile/:userId`
- `GET /match/candidates/:userId`
- `POST /match/swipe`
- `GET /match/list/:userId`
- `POST /chat/send`
- `GET /chat/thread?userA=...&userB=...`

See roadmap for next milestones.
