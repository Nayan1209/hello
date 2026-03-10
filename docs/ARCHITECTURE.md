# Architecture (Draft)

## High-level

- `apps/web`: UI for onboarding, swiping, matching, and chat.
- `apps/api`: business logic, auth integration, recommendation/match logic.
- `packages/ui`: reusable components and theme.
- `packages/config`: shared developer tooling configuration.

## Data domains

- Users
- Profiles
- Preferences
- Swipes
- Matches
- Messages
- Reports/Moderation
