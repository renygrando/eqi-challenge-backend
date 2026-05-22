# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run start:dev     # dev server with watch
npm run build         # compile to dist/
npm run test          # run all unit tests (Jest, rootDir: src, pattern: **/*.spec.ts)
npm run test:watch    # watch mode
npm run test:cov      # coverage report
npm run test:e2e      # e2e tests (test/jest-e2e.json)
```

Run single test file:
```bash
npx jest src/leads/leads.service.spec.ts
```

## Architecture

**Stack:** NestJS 10 · TypeORM 0.3 · SQLite via `better-sqlite3` · class-validator/class-transformer

**Module layout:**
- `AppModule` — root; wires `ConfigModule` (global), `TypeOrmModule` (SQLite, `synchronize: true`), `LeadsModule`, `WebhooksModule`
- `LeadsModule` — owns the `Lead` entity, `LeadsService` (DB ops), `LeadsController` (`GET /leads`); exports `LeadsService`
- `WebhooksModule` — imports `LeadsModule`; registers webhook controllers per version

**URI versioning** is enabled globally (`VersioningType.URI`). Controllers declare version via `@Controller({ path: '...', version: 'N' })`, yielding `/vN/<path>`.

**Validation** uses a global `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true`. Every new endpoint needs a DTO decorated with class-validator.

**No migrations** — TypeORM `synchronize: true` auto-applies schema changes on startup.

## Existing v1 structure (reference for v2 implementation)

| File | Role |
|------|------|
| `src/leads/entities/lead.entity.ts` | TypeORM entity (`leads` table) |
| `src/leads/leads.service.ts` | `createFromV1(input)`, `findAll()` |
| `src/webhooks/v1/dto/leadflow-v1-webhook.dto.ts` | Request DTO for v1 |
| `src/webhooks/v1/webhooks-v1.controller.ts` | `POST /v1/webhooks/leadflow` |

## Challenge task (v2 implementation)

Full spec: [`docs/leadflow-v2-spec.md`](docs/leadflow-v2-spec.md)

Key requirements:
1. **New endpoint** `POST /v2/webhooks/leadflow` — nested payload (`lead.personal.*`, `lead.acquisition.*`, `lead.metadata.*`)
2. **HMAC-SHA256 validation** — header `X-LeadFlow-Signature: sha256=<hex>`, secret from `LEADFLOW_WEBHOOK_SECRET`; reject with `401` if invalid. Use raw request body for HMAC calculation.
3. **Score classification** — persist derived field alongside score: `0–39 → frio`, `40–69 → morno`, `70–100 → quente`
4. **Deprecation headers on v1** — every v1 response must include `Deprecation: true` and `Sunset: Mon, 01 Aug 2026 00:00:00 GMT`
5. **Tests** — at minimum: score classification logic and HMAC signature validation

Expected new files (follow v1 pattern):
- `src/webhooks/v2/dto/leadflow-v2-webhook.dto.ts`
- `src/webhooks/v2/webhooks-v2.controller.ts`
- Register v2 controller in `src/webhooks/webhooks.module.ts`
- Extend `Lead` entity and add `createFromV2` to `LeadsService`
