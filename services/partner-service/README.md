# Partner Service

Partner and booking management service for the Pulcherbook platform. This service manages partner (company) registrations, teams, services, appointments, and availability scheduling.

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL database (Supabase recommended)

### Installation

```bash
pnpm install
```

### Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key configurations:

- `DATABASE_URL`: Your Supabase/PostgreSQL connection string
- `PORT`: Service port (default: 3002)
- `ALLOWED_ORIGINS`: CORS allowed origins

### Running Migrations

```bash
# Generate a new migration
pnpm migration:generate

# Run migrations
pnpm migration:run

# Show migration status
pnpm migration:show
```

### Running

```bash
# Development mode with hot reload
pnpm start:dev

# Production build
pnpm build
pnpm start
```

## API Documentation

Service runs on `http://localhost:3002`

Swagger documentation available at: `http://localhost:3002/api-docs`

Health check: `http://localhost:3002/health`

### Main Endpoints

#### Partners

| Method | Endpoint                        | Description                    | Auth Status      |
| ------ | ------------------------------- | ------------------------------ | ---------------- |
| POST   | `/api/v1/partners`              | Create new partner             | Public (TODO)    |
| GET    | `/api/v1/partners`              | List all partners              | Public           |
| GET    | `/api/v1/partners/search`       | Search partners by location    | Public           |
| GET    | `/api/v1/partners/:id`          | Get partner details            | Public           |
| PUT    | `/api/v1/partners/:id`          | Update partner                 | Public (TODO)    |
| DELETE | `/api/v1/partners/:id`          | Delete partner (soft)          | Public (TODO)    |
| GET    | `/api/v1/partners/:id/availability` | Get full availability      | Public           |

#### Teams

| Method | Endpoint                        | Description                    | Auth Status      |
| ------ | ------------------------------- | ------------------------------ | ---------------- |
| POST   | `/api/v1/teams`                 | Create new team                | Public (TODO)    |
| GET    | `/api/v1/teams`                 | List all teams                 | Public           |
| GET    | `/api/v1/teams/:id`             | Get team details               | Public           |
| PUT    | `/api/v1/teams/:id`             | Update team                    | Public (TODO)    |
| DELETE | `/api/v1/teams/:id`             | Delete team                    | Public (TODO)    |

#### Team Members

| Method | Endpoint                        | Description                    | Auth Status      |
| ------ | ------------------------------- | ------------------------------ | ---------------- |
| POST   | `/api/v1/team-members`          | Add member to team             | Public (TODO)    |
| GET    | `/api/v1/team-members`          | List team members              | Public           |
| GET    | `/api/v1/team-members/:id`      | Get team member details        | Public           |
| DELETE | `/api/v1/team-members/:id`      | Remove member from team        | Public (TODO)    |
| GET    | `/api/v1/team-members/:id/appointments` | Get upcoming appointments | Public    |

#### Services

| Method | Endpoint                        | Description                    | Auth Status      |
| ------ | ------------------------------- | ------------------------------ | ---------------- |
| POST   | `/api/v1/services`              | Create new service             | Public (TODO)    |
| GET    | `/api/v1/services`              | List all services              | Public           |
| GET    | `/api/v1/services/:id`          | Get service details            | Public           |
| PUT    | `/api/v1/services/:id`          | Update service                 | Public (TODO)    |
| DELETE | `/api/v1/services/:id`          | Delete service                 | Public (TODO)    |

#### Team Services

| Method | Endpoint                        | Description                    | Auth Status      |
| ------ | ------------------------------- | ------------------------------ | ---------------- |
| POST   | `/api/v1/team-services`         | Assign service to team         | Public (TODO)    |
| GET    | `/api/v1/team-services`         | List assignments               | Public           |
| GET    | `/api/v1/team-services/:id`     | Get assignment details         | Public           |
| DELETE | `/api/v1/team-services/:id`     | Unassign service from team     | Public (TODO)    |

#### Company Media

| Method | Endpoint                        | Description                    | Auth Status      |
| ------ | ------------------------------- | ------------------------------ | ---------------- |
| POST   | `/api/v1/company-media`         | Upload/add media               | Public (TODO)    |
| GET    | `/api/v1/company-media`         | List media                     | Public           |
| GET    | `/api/v1/company-media/:id`     | Get media details              | Public           |
| PUT    | `/api/v1/company-media/:id`     | Update media (reorder)         | Public (TODO)    |
| DELETE | `/api/v1/company-media/:id`     | Delete media                   | Public (TODO)    |

#### Appointments

| Method | Endpoint                        | Description                    | Auth Status      |
| ------ | ------------------------------- | ------------------------------ | ---------------- |
| POST   | `/api/v1/appointments`          | Book new appointment           | Public (TODO)    |
| GET    | `/api/v1/appointments`          | List appointments              | Public           |
| GET    | `/api/v1/appointments/:id`      | Get appointment details        | Public           |
| PUT    | `/api/v1/appointments/:id`      | Update appointment             | Public (TODO)    |
| PATCH  | `/api/v1/appointments/:id/status` | Update appointment status    | Public (TODO)    |
| DELETE | `/api/v1/appointments/:id`      | Cancel appointment             | Public (TODO)    |
| POST   | `/api/v1/appointments/check-availability` | Check availability  | Public           |

#### Availability

| Method | Endpoint                        | Description                    | Auth Status      |
| ------ | ------------------------------- | ------------------------------ | ---------------- |
| POST   | `/api/v1/availability`          | Create availability schedule   | Public (TODO)    |
| GET    | `/api/v1/availability`          | Get availability schedules     | Public           |
| GET    | `/api/v1/availability/:id`      | Get availability details       | Public           |
| PUT    | `/api/v1/availability/:id`      | Update availability            | Public (TODO)    |
| DELETE | `/api/v1/availability/:id`      | Delete availability            | Public (TODO)    |
| GET    | `/api/v1/availability/slots`    | Get available time slots       | Public           |

## Database

This service uses PostgreSQL (Supabase).

See database documentation:

- [Conceptual Model](docs/database/conceptual-model.md)
- [Physical Model](docs/database/physical-model.md)
- [OpenAPI Specification](docs/openapi/openapi.yaml)

### Main Entities

- **Partners**: Companies registered on the platform
- **Teams**: Groups within partner companies
- **TeamMembers**: Users assigned to teams
- **Services**: Services offered by partners
- **Appointments**: Customer bookings
- **TeamMemberAvailability**: Availability schedules

## Architecture

```
src/
├── db/models/      # TypeORM entities
├── routes/         # API controllers
│   └── v1/
│       └── partners/  # Partner endpoints
├── service/        # Business logic
├── types/          # TypeScript type definitions
└── index.ts        # Main entry point
```

## Development

### Project Structure

- **Models** define database entities using TypeORM decorators
- **Services** contain business logic and database operations
- **Controllers** handle HTTP requests/responses
- **Types** define request/response interfaces

### Adding New Features

1. Create model in `src/db/models/`
2. Create service in `src/service/`
3. Create controller in `src/routes/v1/`
4. Register routes in `src/routes/v1/index.ts`
5. Update documentation

### Testing

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## Environment Variables

See [.env.example](.env.example) for all available configuration options.

Required variables:
- `DATABASE_URL` or individual database connection parameters
- `PORT`
- `ALLOWED_ORIGINS`

## Features

✅ **Implemented**:
- Partner CRUD operations with location-based search
- Teams management (CRUD operations)
- Team members management (add/remove, upcoming appointments)
- Services management (CRUD operations)
- Team-Service assignments (assign services to teams)
- Company media management (upload, reorder, delete)
- Appointments booking system (create, update, cancel, status tracking)
- Availability scheduling (recurring and one-time schedules)
- Available time slots calculation
- Partner availability tree view
- Database migrations support
- Comprehensive Swagger API documentation
- Health check endpoint
- 50+ API endpoints across 8 entity controllers

⚠️ **TODO**:
- Authentication/Authorization (JWT integration with IAM service)
- Advanced booking conflict validation
- Email notifications for appointments
- Calendar integration (iCal, Google Calendar)
- Payment processing integration
- Real-time availability updates
- Appointment reminders
- Analytics and reporting

## Authentication Status

⚠️ **IMPORTANT**: Currently, all endpoints are public. Authentication and authorization will be implemented in a future update:

- Partner owner restrictions (CRUD on own resources)
- Customer restrictions (own appointments)
- Admin access controls
- IAM service integration

## Related Services

- **IAM Service** (port 3001): User authentication and identity management

## Monitoring

The service exposes a health check endpoint at `/health`:

```bash
curl http://localhost:3002/health
```

## Support

For issues or questions, please refer to the main project documentation or create an issue in the project repository.

## License

ISC
