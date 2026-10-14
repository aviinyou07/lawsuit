# Lawsuit — Legal Services Marketplace Platform

Enterprise-grade Legal Services Marketplace connecting citizens and businesses with verified advocates, featuring real-time video consultations (Agora RTC), AI-assisted legal intake triage, automated document drafting workflows, and court case management.

## 🚀 Quick Start Guide

### 1. Database & Cache Infrastructure (Docker Compose)
```bash
# Start PostgreSQL 16 & Redis
docker compose up -d

# Verify database schema & seed data
docker exec -i lawsuit-postgres psql -U postgres -d lawsuit_db -c "\dt"
```

### 2. Node.js Backend API
```bash
cd backend

# Install dependencies (if not already installed)
npm install

# Run database automated test suite (13/13 passing tests)
npm test

# Build TypeScript to production JavaScript (dist/)
npm run build

# Start live development server (runs on http://localhost:5000)
npm run dev
```

### 3. React Native Mobile App (Expo)
```bash
cd mobile

# Install dependencies (if not already installed)
npm install

# Verify TypeScript type safety
npm run typecheck

# Start Expo development server
npm start
```

---

## 🏛️ Project Architecture & Repository Layout

```
lawsuit/
├── plan.md                     # Master Product Blueprint & Technical Architecture Specification
├── docker-compose.yml          # PostgreSQL 16 & Redis container definitions
├── database/                   # Database DDL & Seed scripts
│   ├── schema.sql              # 27 PostgreSQL relational tables, enums, triggers & indexes
│   └── seed.sql                # 11 Legal categories, specializations, services, admin & lawyer
├── backend/                    # Node.js TypeScript REST & WebSocket API
│   ├── src/
│   │   ├── config/             # Environment configurations
│   │   ├── database/           # PostgreSQL connection pool & query helpers
│   │   ├── common/             # JWT auth middleware, RBAC guards & Zod validation
│   │   ├── modules/
│   │   │   ├── auth/           # Mobile SMS OTP & JWT token issuance (/api/v1/auth)
│   │   │   ├── users/          # Client profile management (/api/v1/users)
│   │   │   ├── categories/     # Legal practice areas & specializations (/api/v1/categories)
│   │   │   ├── lawyers/        # Advocate directory, search & onboarding (/api/v1/lawyers)
│   │   │   ├── bookings/       # Slot reservation & quote calculations (/api/v1/bookings)
│   │   │   ├── consultations/  # Agora RTC dynamic token generation (/api/v1/consultations)
│   │   │   ├── triage/         # "Describe My Problem" AI Intake pipeline (/api/v1/triage)
│   │   │   ├── documents/      # Document drafting catalog & orders (/api/v1/documents)
│   │   │   ├── cases/          # Litigation tracker & hearing calendars (/api/v1/cases)
│   │   │   ├── reviews/        # 5-star ratings & client feedback (/api/v1/reviews)
│   │   │   └── admin/          # KYC verification workstation & KPIs (/api/v1/admin)
│   │   ├── chat/               # Socket.io real-time chat & thread persistence
│   │   ├── app.ts              # Express application setup
│   │   └── index.ts            # Server entry point
│   └── test/
│       └── api.test.ts         # Automated end-to-end integration test suite
└── mobile/                     # React Native Expo TypeScript Mobile Application
    ├── App.tsx                 # Root component with SafeArea & QueryClientProvider
    └── src/
        ├── api/                # Axios client with Bearer auth injection interceptor
        ├── navigation/         # Typed React Navigation (Auth, Tabs, Modals)
        ├── store/              # Zustand authentication & profile store
        ├── theme/              # Color palette and design tokens
        ├── types/              # Domain models (User, Lawyer, Appointment, etc.)
        └── screens/
            ├── auth/           # Screens 01-05 (Splash, Welcome, Login, Profile, Permissions)
            └── client/         # Screens 06-35 (Home, Search, Listing, Profile, Booking,
                                #   Room, Review, AI Triage, Services, Settings)
```

---

## 🔒 Security & Bar Council Regulatory Compliance

- **Rule 36 Compliance:** Objective search algorithms without subjective ranking or paid promotional bias.
- **Attorney-Client Privilege:** Ephemeral presigned URLs (15-min expiration) and encrypted document storage.
- **Financial Segregation:** Clear separation between advocate professional consultation fees and platform technology charges with 100% escrow protection.
