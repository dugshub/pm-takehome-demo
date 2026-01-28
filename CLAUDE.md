# AIIG Deliverable Management System

## Overview
Full-stack application for tracking infrastructure project deliverables, deadlines, and responsible project managers.

## Architecture

### Backend (NestJS)
- Location: `/backend`
- Port: 4100 (default, auto-offsets if in use)
- Database: SQLite (TypeORM, Postgres-ready)
- Modules: projects, deliverables, project-managers

### Frontend (React + Vite)
- Location: `/frontend`
- Port: 4200 (default, auto-offsets if in use)
- State: TanStack Query
- Styling: Tailwind CSS

## Development Commands

```bash
# Quick Start (installs deps and launches both servers)
./start.sh

# Backend
cd backend && npm run start:dev   # Start dev server
cd backend && npm run seed        # Seed database
cd backend && npm run build       # Production build

# Frontend
cd frontend && npm run dev        # Start dev server
cd frontend && npm run build      # Production build
```

## Entity Relationships

```
Project (1) ──< (N) Deliverable (N) >── (1) ProjectManager
```

## Key Files

### Backend
- `src/modules/*/entities/*.entity.ts` - TypeORM entities
- `src/modules/*/*.controller.ts` - REST endpoints
- `src/modules/*/*.service.ts` - Business logic
- `src/database/seeds/seed.ts` - Sample data seeder

### Frontend
- `src/pages/*.tsx` - Route components
- `src/hooks/*.ts` - React Query hooks
- `src/api/*.ts` - API client functions
- `src/components/ui/*.tsx` - Reusable UI components

## API Base URL
- Development: http://localhost:4100/api (default)
- CORS dynamically enabled for frontend port

## Database
- Dev: SQLite at `database.sqlite` (project root)
- Prod: Set `DB_TYPE=postgres` + connection env vars
