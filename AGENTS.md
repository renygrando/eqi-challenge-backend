# AGENTS.md

## High-signal repo facts
- This is a single NestJS backend (no monorepo); main wiring is `src/main.ts` and `src/app.module.ts`.
- Runtime stack in code is **MikroORM + SQLite** (`@mikro-orm/*`), not TypeORM.
- `src/main.ts` enables URI versioning (`/v1/...`, `/v2/...`) and global `ValidationPipe` with `whitelist: true` + `forbidNonWhitelisted: true`.

## Setup and run (verified from scripts/config)
- Install deps: `npm install`
- Create env: `cp .env.example .env`
- Run DB migrations: `npm run migration:up` (script is singular `migration:*`)
- Start dev server: `npm run start:dev`
- Build: `npm run build`

## Testing shortcuts and gotchas
- Unit tests: `npm run test`
- Single test file: `npx jest src/<path>/<file>.spec.ts` (Jest `rootDir` is `src` in `package.json`).
- Coverage: `npm run test:cov`
- `npm run test:e2e` points to `test/jest-e2e.json`, but there is no `test/` directory in this repo right now.

## Data and migrations
- SQLite DB file path comes from `DATABASE_PATH` (default `database/leads.sqlite`).
- Migration config is duplicated in `mikro-orm.config.ts` and `MikroOrmModule.forRoot(...)` inside `src/app.module.ts`; keep both aligned when changing ORM config.
- Generated DB files (`database/*.sqlite`) are gitignored.

## Feature wiring conventions
- Leads domain lives in `src/leads/*`; webhook controllers live in `src/webhooks/*`.
- If adding a new webhook version, add a versioned controller under `src/webhooks/vN/` and register it in `src/webhooks/webhooks.module.ts`.
- Because of global validation, every new request contract should use DTOs with `class-validator` decorators.

## Challenge-specific context
- Product spec for LeadFlow v2 is `docs/leadflow-v2-spec.md`.
- Task checklist and evaluation context are in `CHALLENGE.md`.
