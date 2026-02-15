# Garment Management System

A production-ready full-stack web application for managing garment factory operations.

## 📋 Overview

This system digitizes and automates garment factory management including:

- **Employee Management** (Permanent & Temporary workers)
- **Task Tracking** with price history
- **Payroll Generation** with automatic calculations
- **Dashboard & Reporting**

## 🏗️ Architecture

### Backend

- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** JWT with Passport

### Frontend

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State:** Zustand + React Query

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL or Neon account

### Backend Setup

```bash
cd Backend
npm install
npx prisma generate
npm run seed
npm run start:dev
```

Backend runs on `http://localhost:3001`

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 🔐 Default Login

```
Email: admin@garment.com
Password: admin123
```

## 📚 Documentation

- [Backend README](./Backend/README.md)
- [Frontend README](./Frontend/README.md)
- [Project Walkthrough](./.gemini/antigravity/brain/46de0c24-6b6a-45a1-8f88-43f6f27dfa4f/walkthrough.md)

## ✨ Key Features

### Employee Management

- Create/Update/Delete employees
- Support for Permanent & Temporary workers
- Salary configuration with EPF/ETF
- Salary history tracking

### Task Management

- Define task types with pricing
- Price history with audit logs
- Record completed tasks with price snapshots
- Daily activity tracking

### Payroll System

- Monthly payroll generation
- Automatic calculations for permanent employees (EPF/ETF)
- Task-based payment for temporary employees
- Payroll history and reports

### Dashboard

- Real-time statistics
- Employee, task, and payroll metrics
- Visual charts and graphs
- Daily activity overview

## 🛠️ Tech Stack

**Backend:**

- NestJS
- Prisma ORM
- PostgreSQL (Neon)
- Passport JWT
- bcrypt
- class-validator

**Frontend:**

- Next.js 15
- TailwindCSS
- Zustand
- TanStack React Query
- Axios
- Lucide Icons
- Recharts

## 📦 Deployment

### Backend (Render / DigitalOcean)

```bash
cd Backend
docker build -t garment-backend .
docker run -p 3001:3001 garment-backend
```

### Frontend (Vercel)

```bash
cd Frontend
vercel
```

## 🔑 Environment Variables

### Backend (.env)

```
DATABASE_URL=your-postgresql-url
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1d
PORT=3001
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📖 API Documentation

### Authentication

- `POST /api/auth/login`
- `POST /api/auth/change-password`
- `POST /api/auth/me`

### Employees

- `GET /api/employees`
- `POST /api/employees`
- `PATCH /api/employees/:id`
- `DELETE /api/employees/:id`

### Tasks

- `GET /api/tasks/types`
- `POST /api/tasks/types`
- `POST /api/tasks/completed`
- `GET /api/tasks/completed`

### Payroll

- `POST /api/payroll/generate`
- `GET /api/payroll`

### Dashboard

- `GET /api/dashboard/stats`
- `GET /api/dashboard/daily-activity`

## 🏛️ Architecture Highlights

- **Clean Architecture** with Controllers, Services, DTOs
- **SOLID Principles**
- **Type Safety** (TypeScript throughout)
- **Modular Design** - Easy to extend
- **Reusable Components**
- **Security Best Practices**

## 🔒 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Protected routes
- CORS configuration
- Input validation
- Error handling

## 📈 Future Extensibility

The system is designed for easy extension:

- Role-based access control (RBAC)
- Multi-admin support
- Report exports
- Notifications system
- Multi-branch management

## 📝 License

Private Project

## 👥 Author

Garment Management System Team

---

For detailed documentation, see individual README files in Backend and Frontend directories.
