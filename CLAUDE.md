# AIIG Deliverable Management System

## Overview
Full-stack application for tracking infrastructure project deliverables, deadlines, and responsible project managers.

## Architecture

### Backend (NestJS)
- Location: `/backend`
- Port: 3000
- Database: SQLite (TypeORM, Postgres-ready)
- Modules: projects, deliverables, project-managers

### Frontend (React + Vite)
- Location: `/frontend`
- Port: 5173
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
- Development: http://localhost:3000/api
- CORS enabled for localhost:5173

## Database
- Dev: SQLite at `database.sqlite` (project root)
- Prod: Set `DB_TYPE=postgres` + connection env vars
