# Technical Documentation

## Module 3 — Daily Creator Leaderboard (Revenue-Based)

---

# 1. Technical Objective

Build a publicly accessible Daily Creator Leaderboard using a Next.js monorepo application with frontend and backend inside a single project.

The system should:

* use a randomized mock dataset initially for creator revenue
* refresh leaderboard data automatically every 24 hours
* rank creators based only on revenue generated
* store daily leaderboard snapshots
* expose a public leaderboard dashboard
* require no login or authentication
* remain simple and production-ready for V1
* support future migration to real Shopify / GoAffPro source data without rebuild

This module should avoid unnecessary scope and be designed for fast deployment.

---

# 2. Final System Architecture

## Architecture Pattern

Mock Dataset Generator → Ranking Engine → Snapshot Table → Public Dashboard

```text id="4n36fg"
Randomized Creator Dataset
(Mock Revenue Source)
                ↓
        Revenue Ranking Engine
                ↓
   leaderboard_daily_snapshot
                ↓
      Next.js API Layer
                ↓
 Public Leaderboard Dashboard
```

---

## Why This Architecture

This ensures:

* immediate development without waiting for final source access
* fast deployment
* frontend validation early
* creator adoption testing
* no dependency on CSV upload panels
* no dependency on creator authentication
* future support for Shopify / GoAffPro direct integration
* historical leaderboard tracking without rebuilding

The system uses randomized realistic data initially and later swaps to real reporting data.

---

# 3. Technology Stack

| Layer      | Technology                 |
| ---------- | -------------------------- |
| Frontend   | Next.js (App Router)       |
| Backend    | Next.js API Routes         |
| Language   | TypeScript                 |
| ORM        | Prisma                     |
| Database   | PostgreSQL                 |
| UI Styling | Tailwind CSS               |
| Components | ShadCN UI                  |
| Scheduler  | Cron Job                   |
| Deployment | Vercel + PostgreSQL OR AWS |

---

# 4. Monorepo Project Structure

```text id="vltxiw"
creator-leaderboard/
│
├── app/
│   ├── leaderboard/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── leaderboard/
│   │   │   └── route.ts
│   │   │
│   │   └── cron/
│   │       └── refresh/
│   │           └── route.ts
│
├── components/
│   ├── leaderboard-table.tsx
│   ├── top-creators.tsx
│   └── header.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── ranking-engine.ts
│   ├── mock-generator.ts
│   └── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── scripts/
│   └── refreshLeaderboard.ts
│
├── docs/
│   └── technical-doc.md
│
├── .env
├── .env.example
├── package.json
├── README.md
└── AGENTS.md
```

---

# 5. Ranking Logic

## Ranking Metric

Revenue Generated Only

No hybrid score.

No commission-based ranking.

No weighted formula.

---

## Ranking Formula

```text id="tbz9n0"
Sort creators by Revenue Generated (DESC)
```

Highest revenue:

Rank #1

Lowest revenue:

Last Rank

---

## Tie Breaker Logic

If two creators have equal revenue:

Use:

1. Stable ordering by creator ID
   OR
2. Earlier source record order

This avoids unnecessary rank fluctuation.

---

# 6. Mock Data Strategy

## V1 Data Source

Randomized Mock Dataset

This will simulate:

* creator name
* revenue generated

The goal is:

* realistic leaderboard behavior
* believable ranking movement
* testing without waiting for final production data

---

## Mock Data Rules

The system should NOT generate fully random unstable rankings.

Instead:

Use controlled realistic simulation where:

* top creators remain relatively strong
* mid creators fluctuate moderately
* smaller creators move naturally
* rankings feel believable

This improves creator trust and product realism.

---

## Daily Refresh Logic

Every 24 hours:

The system should:

* regenerate revenue values
* preserve realistic leaderboard movement
* create a fresh ranking snapshot

This should feel like a real live leaderboard.

---

# 7. Future Data Source Migration

## Future Production Source

Once access is available:

Replace mock dataset with:

* Shopify reporting
* GoAffPro exports
* internal reporting feeds

The architecture should support this without major rebuild.

Only source layer changes.

Ranking engine remains same.

---

# 8. Database Design

We maintain:

Two Core Tables

---

# Table 1 — creator_performance_source

Stores creator master data + current generated revenue.

This acts as the active source table.

Initially powered by:

Mock Generator

Later powered by:

Real source integrations

---

## Schema

| Column            | Type      | Description           |
| ----------------- | --------- | --------------------- |
| id                | UUID      | Primary key           |
| full_name         | VARCHAR   | Creator full name     |
| revenue_generated | DECIMAL   | Revenue value         |
| source_date       | DATE      | Source reporting date |
| created_at        | TIMESTAMP | Record creation       |
| updated_at        | TIMESTAMP | Last update           |

---

# Table 2 — leaderboard_daily_snapshot

Stores calculated leaderboard rankings daily.

---

## Schema

| Column            | Type      | Description          |
| ----------------- | --------- | -------------------- |
| id                | UUID      | Primary key          |
| source_id         | UUID (FK) | Linked source record |
| snapshot_date     | DATE      | Daily snapshot date  |
| revenue_generated | DECIMAL   | Revenue value        |
| rank_position     | INTEGER   | Final rank           |
| created_at        | TIMESTAMP | Record creation      |

---

## Why Snapshot Table

This supports:

* historical tracking
* audit trail
* future rank movement indicators
* future reporting layers

without mutating source records.

This is mandatory.

---

# 9. Prisma Schema Design

```prisma id="1a2xul"
model CreatorPerformanceSource {
  id                String   @id @default(uuid())
  fullName          String
  revenueGenerated  Float
  sourceDate        DateTime
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  snapshots         LeaderboardSnapshot[]
}

model LeaderboardSnapshot {
  id                String   @id @default(uuid())
  sourceId          String
  snapshotDate      DateTime
  revenueGenerated  Float
  rankPosition      Int
  createdAt         DateTime @default(now())

  source            CreatorPerformanceSource
                    @relation(fields: [sourceId], references: [id])

  @@index([snapshotDate])
}
```

---

# 10. API Design

---

# GET Latest Leaderboard

## Endpoint

```text id="w2mh58"
GET /api/leaderboard
```

---

## Purpose

Returns:

Latest Leaderboard Snapshot Only

This powers the public dashboard.

---

## Response

```json id="52v9fk"
[
  {
    "rank": 1,
    "fullName": "Aman Sharma",
    "revenue": 42000
  }
]
```

Sorted by:

rank ASC

---

# POST Refresh Leaderboard

## Endpoint

```text id="7kvvxj"
POST /api/cron/refresh
```

---

## Purpose

Used for:

* scheduled cron execution
* manual testing
* leaderboard regeneration

---

## Flow

1. Generate / refresh mock dataset
2. Sort by revenue descending
3. Assign rank positions
4. Insert snapshot rows
5. Return success response

This is the system’s refresh engine.

---

# 11. Frontend UI

## Public Route

```text id="bov3cf"
/leaderboard
```

---

## UI Requirements

### Header Section

Show:

* Page title
* subtitle
* last updated timestamp

---

### Leaderboard Table

Columns:

* Rank
* Creator Name
* Revenue

---

## Optional Nice-to-Have

Still safe for V1:

* Top 3 creator highlight cards
* mobile responsiveness
* minimal creator spotlight section

No complex analytics.

No private dashboard.

---

# 12. Daily Refresh Job

## Cron Frequency

Runs every:

24 Hours

Example:

```text id="9eqv1w"
12:30 AM IST daily
```

---

## Job Flow

```text id="lf5crs"
Generate mock revenue dataset
        ↓
Sort by revenue
        ↓
Assign rank positions
        ↓
Insert snapshot rows
        ↓
Dashboard reflects latest ranking
```

This is the production refresh mechanism.

---

# 13. Deployment Strategy

## Recommended

Vercel + Managed PostgreSQL

Recommended DB providers:

* Neon
* Supabase PostgreSQL

OR

AWS + RDS

---

## Preferred for V1

Vercel + PostgreSQL

because:

* faster deployment
* lower infrastructure effort
* easier handover
* simpler maintenance

---

# 14. Error Handling

System must safely handle:

* failed cron execution
* mock generation issues
* duplicate creator records
* invalid revenue values
* DB write failures

Fallback behavior:

Show Last Successful Leaderboard

Never show broken UI.

Never expose empty rankings.

---

# 15. Technical Debt (Deferred Scope)

These are intentionally excluded from V1.

---

## A. Real Shopify / GoAffPro Integration

Future:

Replace mock data with real reporting source

---

## B. Commission-Based Ranking

Future scope only

---

## C. Orders / Conversion / Views Visibility

Future enhancement only

---

## D. Authentication Layer

Skipped intentionally

Leaderboard is public

---

## E. Admin Panel

Future:

* upload management
* reporting visibility
* job logs

---

## F. WhatsApp Delivery

Future:

* leaderboard nudges
* creator engagement loops

---

# Final Locked V1 Scope

| Item                | Final Decision             |
| ------------------- | -------------------------- |
| Project Type        | Next.js Monorepo           |
| Ranking Logic       | Revenue Only               |
| Visible Fields      | Rank + Name + Revenue      |
| Initial Data Source | Randomized Mock Dataset    |
| Future Data Source  | Shopify / GoAffPro         |
| Source Table        | creator_performance_source |
| Snapshot Table      | leaderboard_daily_snapshot |
| Backend             | Next.js API                |
| Frontend            | Public Dashboard           |
| Database            | PostgreSQL                 |
| ORM                 | Prisma                     |
| Refresh             | 24h Cron                   |
| Auth                | Not Required               |
| Delivery            | Public Dashboard           |
