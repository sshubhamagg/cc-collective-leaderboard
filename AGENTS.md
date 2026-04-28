# AGENTS.md

## Project Rules

This is Module 3 of Conscious Chemist Creator OS.

Project:
Daily Creator Leaderboard (Revenue-Based)

## Core Rules

Build ONLY what is asked.

Do NOT add:

* authentication
* admin panel
* CSV upload UI
* commission logic
* payout logic
* analytics dashboards
* creator profile pages
* unnecessary abstractions

Avoid scope creep.

Keep V1 intentionally simple.

## Stack

* Next.js App Router
* TypeScript
* Prisma
* PostgreSQL
* Tailwind CSS
* ShadCN where useful

## Architecture

Public Leaderboard only

Source Dataset → Revenue Ranking Engine → Snapshot Table → Public Dashboard

## Ranking Logic

Revenue only.

Sort descending by revenue.

Highest revenue = Rank 1.

Tie breaker:
Stable ordering by creator ID.

## UI Rules

Minimal clean UI.

Do not overdesign.

Production-grade simplicity.

## Coding Rules

Prefer clean modular code.

Avoid unnecessary helper files.

Avoid premature optimization.

No fake mock systems unless explicitly requested.

Always production-safe.

## Before Writing Code

Check existing files first.

Avoid duplicate implementations.

Update existing files instead of creating parallel logic.
