# PM Deliverable Tracker

A full-stack demo application for tracking project deliverables, deadlines, and responsible project managers.

## Quick Start

```bash
./start.sh
```

This single command will:
- Install all dependencies (backend + frontend)
- Seed the database with sample data (if needed)
- Start both servers with automatic port conflict detection
- Display a summary table with URLs when ready

**Default ports:** Backend `4100`, Frontend `4200` (auto-increments if in use)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | NestJS + TypeORM |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| State | TanStack Query |

## Features

- **Dashboard** - Overview with upcoming/overdue deliverables
- **Projects** - CRUD with PM ownership, status tracking
- **Deliverables** - Filter by project, status, date range
- **Project Managers** - Track assignments and workload
- **Visual Indicators** - Status badges, user avatars with consistent colors

## Screenshots

The app includes:
- Status badges (Active/Completed/On Hold for projects, Pending/In Progress/Completed/Overdue for deliverables)
- User avatars with initials and consistent color coding
- Responsive tables with sorting and filtering

## Project Structure

```
├── start.sh              # One-command startup script
├── database.sqlite       # SQLite database (auto-created)
├── backend/              # NestJS API
│   └── src/
│       ├── modules/      # projects, deliverables, project-managers
│       └── database/     # TypeORM config + seeds
└── frontend/             # React + Vite
    └── src/
        ├── pages/        # Route components
        ├── components/   # UI components
        └── hooks/        # React Query hooks
```

## API Endpoints

| Resource | Endpoints |
|----------|-----------|
| Projects | `GET/POST /api/projects`, `GET/PATCH/DELETE /api/projects/:id` |
| Deliverables | `GET/POST /api/deliverables`, `GET /api/deliverables/upcoming` |
| Project Managers | `GET/POST /api/project-managers`, `GET/PATCH/DELETE /api/project-managers/:id` |

## Data Model

```
ProjectManager (1) ──< (N) Project ──< (N) Deliverable >── (1) ProjectManager
       │                                        │
       └── owner                                └── assignee
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 4100 | Backend port |
| `FRONTEND_PORT` | 4200 | Frontend port |
| `DB_TYPE` | sqlite | Database type (sqlite/postgres) |
| `VITE_API_URL` | auto | API URL for frontend |

## Development

```bash
# Manual startup (if not using start.sh)
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run dev

# Seed database
cd backend && npm run seed

# Build for production
cd backend && npm run build
cd frontend && npm run build
```

## License

MIT
