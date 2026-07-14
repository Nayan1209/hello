# Complete Setup and Launch Guide (Cloud -> App -> Play Store)

This guide gives you all steps from running the backend in cloud to publishing an Android app on Play Store.

## 1) Prerequisites

- Node.js 20+
- npm 10+
- GitHub account
- Google Play Console developer account
- Cloud workspace (Codespaces/Gitpod/any Linux VM)

## 2) Open project in cloud and run backend

From repository root:

```bash
npm install
npm run start:api
```

Expected log:

```text
API running on http://localhost:4000
```

## 3) Verify backend is working

Open second terminal and run:

```bash
curl http://127.0.0.1:4000/health
```

Expected response:

```json
{"ok":true}
```

Run tests:

```bash
npm run test
```

## 4) Quick API smoke test flow

### 4.1 Register user

```bash
curl -X POST http://127.0.0.1:4000/auth/register \
  -H "content-type: application/json" \
  -d '{"name":"Asha","phone":"111","password":"pass"}'
```

### 4.2 Login user

```bash
curl -X POST http://127.0.0.1:4000/auth/login \
  -H "content-type: application/json" \
  -d '{"phone":"111","password":"pass"}'
```

Copy `token` from response.

### 4.3 Create profile

```bash
curl -X POST http://127.0.0.1:4000/profile \
  -H "content-type: application/json" \
  -H "authorization: Bearer <TOKEN>" \
  -d '{"age":26,"bio":"Engineer","location":"Pune","community":"Samajh"}'
```

### 4.4 Get candidates

```bash
curl "http://127.0.0.1:4000/match/candidates?location=Pune&minAge=22&maxAge=35" \
  -H "authorization: Bearer <TOKEN>"
```

## 5) Deploy backend (recommended order)

1. Choose provider: Render / Railway / Fly.io / AWS.
2. Create service from this repo.
3. Start command:

```bash
npm run start:api
```

4. Set environment variables as needed (later: DB, JWT, secrets).
5. Confirm deployed `/health` endpoint returns `{\"ok\":true}`.

## 6) Build mobile app (React Native with Expo)

In cloud/local:

```bash
npx create-expo-app@latest apps/mobile
cd apps/mobile
npm install
```

Configure API base URL in mobile app to your deployed backend URL.

## 7) Connect mobile screens to backend

Implement minimum screens:

- Register/Login
- Edit Profile
- Candidate Swipe
- Matches list
- Chat
- Report/Block

Use bearer token from `/auth/login` and attach:

```http
Authorization: Bearer <token>
```

## 8) Play Store preparation checklist

You must prepare:

- Privacy Policy page URL
- Terms of Service URL
- App name + descriptions
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots
- Data Safety form answers
- Content rating answers

## 9) Build Android `.aab`

Using Expo EAS:

```bash
npm install -g eas-cli
cd apps/mobile
eas build:configure
eas build -p android --profile production
```

## 10) Publish via Google Play Console

1. Create app in Play Console.
2. Fill Store Listing.
3. Complete App Content (privacy, ads, data safety, rating).
4. Create Internal Testing release.
5. Upload `.aab`.
6. Test with internal testers.
7. Promote to Closed/Open testing.
8. Submit Production release.

## 11) Recommended production hardening before launch

- PostgreSQL + Prisma
- Password hashing and OTP flow
- Rate limiting and abuse detection
- Image moderation for profile photos
- Monitoring and alerting
- Incident response and moderation SOP

## 12) Troubleshooting

- **Port not accessible in cloud:** expose/forward port `4000` in your cloud IDE.
- **401 unauthorized:** verify `Authorization: Bearer <token>` header.
- **No candidates:** ensure profile exists and filters are not too strict.
- **Cannot chat:** users must be matched and not blocked.

