# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Artifacts

### Tesla Lightshow at COTA (`artifacts/tesla-lightshow`)
- Single-page RSVP website for the Tesla Lightshow at COTA event on March 18th
- React + Vite frontend with dramatic neon/electric visual design
- RSVP form collects: name, email, guest count, optional message
- Animated SVG Tesla cars and COTA tower illustration
- Connected to backend RSVP API

### API Server (`artifacts/api-server`)
- Express 5 backend
- RSVP endpoints: POST /api/rsvps, GET /api/rsvps
- PostgreSQL database via Drizzle ORM

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
