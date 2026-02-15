# Garment Management System - Frontend

Modern Next.js frontend for the Garment Management System.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Zustand
- **Data Fetching:** TanStack React Query
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Charts:** Recharts

## Features

- ✅ JWT Authentication with Zustand
- ✅ Protected Routes
- ✅ Collapsible Sidebar Navigation
- ✅ Dashboard with Statistics
- ✅ Employee Management (List, Create, Update, Delete)
- ✅ Task Management
- ✅ Payroll Generation
- ✅ Responsive Design
- ✅ Modern UI with TailwindCSS

## Prerequisites

- Node.js 18+
- npm
- Running Backend API

## Setup

1. **Install Dependencies**

```bash
npm install
```

2. **Configure Environment**
   Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

3. **Run Development Server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Default Login

```
Email: admin@garment.com
Password: admin123
```

## Project Structure

```
Frontend/
├── app/
│   ├── (auth)/
│   │   └── login/          # Login page
│   ├── dashboard/
│   │   ├── employees/      # Employee management
│   │   ├── tasks/          # Task management
│   │   ├── payroll/        # Payroll
│   │   ├── layout.tsx      # Dashboard layout
│   │   └── page.tsx        # Dashboard overview
│   └── page.tsx            # Root redirect
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx     # Navigation sidebar
│   └── ui/                 # Reusable UI components
├── lib/
│   └── api.ts              # Axios instance
├── store/
│   └── authStore.ts        # Zustand auth state
└── types/
    └── index.ts            # TypeScript types
```

## Production Build

```bash
npm run build
npm start
```

## Deployment (Vercel)

```bash
vercel
```

Set environment variable in Vercel:

- `NEXT_PUBLIC_API_URL`: Your production backend URL
