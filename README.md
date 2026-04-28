# Creator Leaderboard

Daily Creator Leaderboard (Revenue-Based) for Conscious Chemist Creator OS Module 3.

## Stack

- Next.js App Router
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS

## Environment Variables

Create `.env.local` or `.env` with:

```bash
DATABASE_URL=
CRON_SECRET=
NODE_ENV=development
```

`CRON_SECRET` is optional in local development and should be set in production to protect `POST /api/cron/refresh`. Send it as `Authorization: Bearer <CRON_SECRET>`.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run format`
- `npm run format:check`
- `npm run typecheck`
- `npm run prisma:generate`
- `npm run prisma:validate`
- `npm run prisma:migrate:dev`
- `npm run prisma:migrate:deploy`
- `npm run refresh:leaderboard`

## Public Surface

- `GET /api/leaderboard`
- `POST /api/cron/refresh`
- `/leaderboard`

`GET /api/leaderboard` returns the latest leaderboard snapshot only.

`POST /api/cron/refresh` refreshes source data, ranks creators by revenue only, replaces the current day's snapshot inside a database transaction, and returns refresh metadata.

## Manual Refresh

Run:

```bash
npm run refresh:leaderboard
```

This uses the same refresh flow as the cron route.

## Production Notes

- Set a valid PostgreSQL `DATABASE_URL`
- Set `CRON_SECRET` in production and configure your scheduler to send `Authorization: Bearer <CRON_SECRET>`
- Run `npm run prisma:generate` during install/build if your platform does not run `postinstall`
- Trigger `POST /api/cron/refresh` from your scheduler once every 24 hours
- The refresh flow is idempotent per day because it replaces same-day snapshot rows inside a transaction

## Current Scope

V1 includes:

- revenue-based mock source generation
- source table refresh
- daily snapshot generation
- latest leaderboard API
- public leaderboard page

V1 does not include authentication, admin tooling, analytics dashboards, payout logic, or creator profile pages.
