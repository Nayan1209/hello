# Publish on Google Play Store (Step-by-Step)

## 1) Build mobile app client

This repo currently has a backend MVP. For Play Store, create a React Native app (Expo or native) in `apps/mobile` that consumes the backend endpoints.

Recommended stack:
- React Native + Expo
- React Navigation
- Secure token storage (expo-secure-store)

## 2) Prepare required legal and store assets

You will need:
- Privacy Policy URL
- Terms of Service URL
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (phone)
- Content rating questionnaire answers

## 3) Create Google Play Console app

1. Go to Google Play Console.
2. Create app (default language + app name).
3. Fill store listing (title, short/long description, screenshots, icon).
4. Complete App content section (privacy policy, ads, data safety, content rating).

## 4) Build Android release artifact

If using Expo EAS:

```bash
npm install -g eas-cli
cd apps/mobile
eas build:configure
eas build -p android --profile production
```

This produces an `.aab` bundle.

## 5) Upload and release

1. Open Play Console -> Testing -> Internal testing.
2. Create release and upload `.aab`.
3. Add testers and test for crashes/login/chat.
4. Promote to Closed/Open testing.
5. Submit Production release.

## 6) Recommended pre-launch checklist

- Backend deployed on stable HTTPS URL
- Rate limiting enabled
- Abuse/report moderation process ready
- Crash-free sessions acceptable
- App policy compliance checked
