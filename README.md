# Samajh Match

A clean starter structure for a community-focused matchmaking app (Tinder-style flow with culture-first constraints).

## Repository Structure

```text
apps/
  web/        # Frontend app (React/Next/Vite)
  api/        # Backend API service
packages/
  ui/         # Shared UI components
  config/     # Shared lint/ts/build configs
docs/         # Product and technical documentation
infra/        # Deployment and infrastructure configs
scripts/      # Local automation scripts
.github/
  workflows/  # CI workflows
```

## Quick Start

1. Install Node.js 20+.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development placeholders:
   ```bash
   npm run dev:web
   npm run dev:api
   ```

## Initial Product Modules

- Authentication and profile verification
- Community preferences and filters
- Swipe/match engine
- Chat and safety reporting
- Admin moderation dashboard

## Next Steps

- Pick frontend stack (Next.js recommended)
- Pick backend stack (Node + Fastify/Nest)
- Add DB (PostgreSQL + Prisma)
- Add auth (Clerk/Auth.js/Firebase)
- Add CI, testing, and deployment pipeline
