# AIIG Deliverable Management System

A full-stack web application for Americas Infrastructure Investments Group (AIIG) to track project deliverables, deadlines, and responsible project managers.

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Backend | NestJS | REST API framework |
| ORM | TypeORM | Database abstraction |
| Database | SQLite (dev) / PostgreSQL (prod) | Data persistence |
| Frontend | React 18 + Vite | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| State | TanStack Query | Server state management |

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### 1. Backend Setup

```bash
cd backend
npm install
npm run seed    # Populate sample data
npm run start:dev
```

Backend runs at: http://localhost:3000

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## Project Structure

```
aiig-deliverables/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── projects/         # Project CRUD
│   │   │   ├── deliverables/     # Deliverable CRUD
│   │   │   └── project-managers/ # PM CRUD
│   │   ├── database/             # TypeORM config + seeds
│   │   └── common/               # Shared entities
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/                # Route components
│   │   ├── components/           # UI components
│   │   ├── hooks/                # React Query hooks
│   │   ├── api/                  # API client
│   │   └── types/                # TypeScript types
│   └── package.json
│
└── README.md
```

## API Endpoints

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/projects?search= | List projects (with search) |
| GET | /api/projects/:id | Get project with deliverables |
| POST | /api/projects | Create project |
| PATCH | /api/projects/:id | Update project |
| DELETE | /api/projects/:id | Delete project |

### Deliverables
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/deliverables | List with filters (?projectId, ?status, ?dueBefore, ?dueAfter) |
| GET | /api/deliverables/upcoming | Next 30 days |
| POST | /api/deliverables | Create deliverable |
| PATCH | /api/deliverables/:id | Update deliverable |
| DELETE | /api/deliverables/:id | Delete deliverable |

### Project Managers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/project-managers | List all PMs |
| GET | /api/project-managers/:id | Get PM with deliverables |
| POST | /api/project-managers | Create PM |
| PATCH | /api/project-managers/:id | Update PM |
| DELETE | /api/project-managers/:id | Delete PM |

## Database

### Development (SQLite)
SQLite is used by default. Database file: `backend/data/database.sqlite`

### Production (PostgreSQL)
Set environment variables to switch to PostgreSQL:

```bash
export DB_TYPE=postgres
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=yourpassword
export DB_DATABASE=aiig
```

## Entity Model

```
Project (1) ──────< (N) Deliverable (N) >────── (1) ProjectManager
```

- **Project**: Infrastructure projects (name, status, dates)
- **Deliverable**: Tasks with deadlines (name, dueDate, status)
- **ProjectManager**: Responsible personnel (name, email, department)

## Features

- **Dashboard**: Overview with upcoming/overdue deliverables
- **Project Search**: Find projects by name
- **Deliverable Tracking**: Filter by project, status, date range
- **CRUD Operations**: Full create/read/update/delete for all entities
- **Status Indicators**: Visual badges (pending, in_progress, completed, overdue)

## Security Assumptions (for production)

- JWT-based authentication
- Role-based access control (admin, manager, viewer)
- API rate limiting
- Input validation via class-validator
- CORS restricted to known origins

## Technical Risks

- SQLite not suitable for production (single writer limitation)
- No authentication in current implementation
- No audit trail for data changes

## License

Proprietary - AIIG Internal Use Only
