# Garment Management System - Backend

Production-ready NestJS backend for garment factory management.

## Tech Stack

- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** JWT with Passport
- **Validation:** class-validator, class-transformer

## Features

- ✅ JWT Authentication
- ✅ Employee Management (Permanent/Temporary)
- ✅ Salary Configuration
- ✅ Task Type Management with Price History
- ✅ Task Entry Recording (with price snapshots)
- ✅ Payroll Generation
- ✅ Dashboard Stats & Daily Activity

## Prerequisites

- Node.js 18+
- PostgreSQL (or Neon cloud database)
- npm

## Setup

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment**
   Create `.env` file:

```bash
DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
PORT=3001
NODE_ENV=development
```

3. **Run Migrations**

```bash
npx prisma migrate dev
```

4. **Seed Database**

```bash
npm run seed
```

5. **Generate Prisma Client**

```bash
npx prisma generate
```

## Running the App

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/me` - Get current user

### Employees

- `GET /api/employees` - List all employees
- `POST /api/employees` - Create employee
- `GET /api/employees/:id` - Get employee by ID
- `PATCH /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/stats` - Get employee stats

### Tasks

- `POST /api/tasks/types` - Create task type
- `GET /api/tasks/types` - List task types
- `PATCH /api/tasks/types/:id` - Update task type (logs price history)
- `POST /api/tasks/completed` - Record completed task
- `GET /api/tasks/completed` - List completed tasks
- `GET /api/tasks/stats` - Get task stats

### Payroll

- `POST /api/payroll/generate?month=1&year=2026` - Generate payroll
- `GET /api/payroll` - List all payrolls
- `GET /api/payroll/employee/:employeeId` - Get payroll by employee

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/daily-activity` - Get daily activity

## Default Credentials

```
Email: admin@garment.com
Password: admin123
```

## Deployment

```bash
docker build -t garment-backend .
docker run -p 3001:3001 garment-backend
```
