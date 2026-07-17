# System Architecture

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER BROWSER                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │  Login   │  │ Signup   │  │  Worker  │  │  Admin   │         │
│  │ /page    │  │ /signup  │  │ /worker  │  │ /admin   │         │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘         │
│       │             │              │              │               │
└───────┼─────────────┼──────────────┼──────────────┼───────────────┘
        │             │              │              │
        └─────────────┴──────────────┴──────────────┘
                      │
                      ▼
        ┌─────────────────────────────┐
        │   NEXT.JS API ROUTES        │
        ├─────────────────────────────┤
        │                             │
        │  /api/auth/login            │
        │  /api/auth/signup           │
        │  /api/sessions/checkin      │
        │  /api/sessions/checkout     │
        │  /api/admin/stats           │
        │  /api/admin/invite          │
        │                             │
        └──────────────┬──────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
    ┌────────────────┐        ┌────────────────┐
    │  lib/auth.ts   │        │  lib/users.ts  │
    ├────────────────┤        ├────────────────┤
    │                │        │                │
    │ • Hash Pass    │        │ • Get User     │
    │ • Verify Pass  │        │ • Create User  │
    │ • Create JWT   │        │ • Get Sessions │
    │ • Verify JWT   │        │ • Create Sess  │
    │ • Set Cookie   │        │ • End Session  │
    │ • Get Cookie   │        │ • Get Stats    │
    │                │        │ • Get Leader   │
    │                │        │ • Gen Invites  │
    └────────┬───────┘        └────────┬───────┘
             │                         │
             └────────────┬────────────┘
                          │
                          ▼
                  ┌──────────────────┐
                  │   lib/db.ts      │
                  ├──────────────────┤
                  │                  │
                  │  SQLite Database │
                  │                  │
                  │  Tables:         │
                  │  • users         │
                  │  • sessions      │
                  │  • admin_invites │
                  │                  │
                  └──────────────────┘
```

## Component Architecture

```
┌────────────────────────────────────────────────────────────┐
│              PAGES (app/app/)                              │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  page.tsx (Login)                                          │
│  ├── AnimatedBackground                                   │
│  └── Form → API                                           │
│                                                             │
│  signup/page.tsx                                           │
│  ├── AnimatedBackground                                   │
│  └── Form → API                                           │
│                                                             │
│  worker/page.tsx                                           │
│  ├── Check-in Button → /api/sessions/checkin             │
│  ├── Check-out Button → /api/sessions/checkout           │
│  └── Status Display                                       │
│                                                             │
│  admin/page.tsx                                            │
│  ├── AdminStats Component                                 │
│  ├── AdminSessions Component                              │
│  ├── AdminLeaderboard Component                           │
│  ├── InviteModal Component                                │
│  └── Tabs: Overview, Sessions, Leaderboard               │
│                                                             │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│           COMPONENTS (components/)                         │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  AnimatedBackground.tsx                                    │
│  ├── Canvas Element                                        │
│  └── Particle Animation (GSAP)                            │
│                                                             │
│  AdminStats.tsx                                            │
│  ├── Stats Cards Array                                     │
│  └── GSAP Stagger Animation                               │
│                                                             │
│  AdminSessions.tsx                                         │
│  ├── Table Layout                                          │
│  └── Online Users List                                     │
│                                                             │
│  AdminLeaderboard.tsx                                      │
│  ├── Ranking Table                                         │
│  └── Hours Calculation                                     │
│                                                             │
│  InviteModal.tsx                                           │
│  ├── Email Input                                           │
│  ├── API Call                                              │
│  └── Code Copy Button                                      │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
User Input (email, password)
         │
         ▼
    POST /api/auth/login
         │
         ├─► Validate Input
         │
         ├─► getUserByEmail()
         │
         ├─► bcryptjs.compare()  (password verification)
         │
         ├─► createToken()  (JWT generation)
         │
         ├─► setAuthCookie()  (secure storage)
         │
         └─► Return user data
              {
                success: true,
                user: { id, email, name, role }
              }
              │
              ▼
         Store in localStorage
              │
              ▼
         Redirect to dashboard
```

## Session Flow

```
Worker Dashboard
     │
     ├─ Check-in
     │   │
     │   ├─ POST /api/sessions/checkin
     │   │   │
     │   │   ├─ Verify JWT token
     │   │   │
     │   │   ├─ createSession(userId)
     │   │   │   {
     │   │   │     INSERT into sessions
     │   │   │     (id, user_id, check_in)
     │   │   │   }
     │   │   │
     │   │   └─ Return session
     │   │
     │   └─ Update UI
     │
     └─ Check-out
         │
         ├─ POST /api/sessions/checkout
         │   │
         │   ├─ Verify JWT token
         │   │
         │   ├─ Find active session
         │   │
         │   ├─ endSession(sessionId)
         │   │   {
         │   │     UPDATE sessions
         │   │     SET check_out = now()
         │   │     AND duration_seconds = calc
         │   │   }
         │   │
         │   └─ Return session
         │
         └─ Update UI
```

## Admin Invite Flow

```
Admin Dashboard
     │
     ├─ Click "Invite Admin"
     │   │
     │   └─ Open InviteModal
     │
     ├─ Enter email
     │   │
     │   └─ POST /api/admin/invite
     │       │
     │       ├─ Verify admin JWT
     │       │
     │       ├─ createAdminInvite()
     │       │   {
     │       │     code = generateInviteCode()
     │       │     INSERT into admin_invites
     │       │     (id, email, code, created_by)
     │       │   }
     │       │
     │       └─ Return code
     │
     └─ Display code
         │
         ├─ Copy to clipboard
         │
         └─ Share with new admin
             │
             └─ New admin uses code on signup
```

## Database Schema

```
┌──────────────────────────┐
│        users             │
├──────────────────────────┤
│ id (UUID, PK)            │
│ email (TEXT, UNIQUE)     │
│ password (TEXT)          │
│ name (TEXT)              │
│ role (TEXT)              │
│ created_at (DATETIME)    │
│ updated_at (DATETIME)    │
└──────────────────────────┘
          │
          │ 1:N
          │
          ▼
┌──────────────────────────┐
│      sessions            │
├──────────────────────────┤
│ id (UUID, PK)            │
│ user_id (UUID, FK)   ────┤─► users.id
│ check_in (DATETIME)      │
│ check_out (DATETIME)     │
│ duration_seconds (INT)   │
│ created_at (DATETIME)    │
└──────────────────────────┘

          user_id ◄─────────┐
                            │
                            │
┌──────────────────────────┐│
│   admin_invites         ││
├──────────────────────────┤│
│ id (UUID, PK)            │
│ email (TEXT, UNIQUE)     │
│ code (TEXT, UNIQUE)      │
│ created_by (UUID, FK) ──┘└─► users.id
│ used (BOOLEAN)           │
│ created_at (DATETIME)    │
└──────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│  BROWSER LAYER                                          │
│  - HTTPS only (Vercel)                                 │
│  - HTTP-only cookies (XSS prevention)                 │
│  - SameSite=Lax (CSRF prevention)                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  API LAYER                                              │
│  - JWT verification on every request                   │
│  - Role-based access control                           │
│  - Input validation                                    │
│  - Type-safe TypeScript                               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  BUSINESS LOGIC LAYER                                   │
│  - Password hashing (BCrypt)                           │
│  - Token generation (JWT)                              │
│  - Invite code validation                              │
│  - Role checking                                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  DATABASE LAYER                                         │
│  - Foreign key constraints                             │
│  - Parameterized queries (SQL injection prevention)   │
│  - Indexed queries (performance)                       │
│  - Data validation                                     │
└─────────────────────────────────────────────────────────┘
```

## Request/Response Lifecycle

```
User Action (Click)
     │
     ▼
Event Handler (React)
     │
     ▼
API Call (fetch)
     │
     ├─ Headers: Content-Type
     ├─ Headers: Cookies (JWT)
     └─ Body: JSON data
     │
     ▼
API Route Handler (Next.js)
     │
     ├─ Extract token from cookie
     ├─ Verify token with verifyToken()
     ├─ Check role if needed
     ├─ Validate request body
     └─ Call business logic
     │
     ▼
Business Logic (lib/users.ts, lib/auth.ts)
     │
     ├─ Query database
     ├─ Process data
     ├─ Calculate results
     └─ Return response
     │
     ▼
API Response (JSON)
     │
     ├─ Status code
     ├─ Success/error data
     └─ Headers
     │
     ▼
Client Handler (React)
     │
     ├─ Parse JSON
     ├─ Check status
     ├─ Update state
     └─ Update UI
     │
     ▼
User Sees Result
     │
     └─ Button feedback
     │  Status display
     │  Error message
     │  Or success notification
```

## Deployment Architecture (Vercel)

```
┌──────────────────────────────────────────┐
│         vercel.com                       │
├──────────────────────────────────────────┤
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Edge Network (Static Files)     │   │
│  │  - Fastest global delivery       │   │
│  │  - CSS, JS, images               │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Serverless Functions (API)      │   │
│  │  - Auto-scaling                  │   │
│  │  - Each request isolated         │   │
│  │  - No server management          │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Environment Variables           │   │
│  │  - JWT_SECRET                    │   │
│  │  - NEXT_PUBLIC_API_URL           │   │
│  │  - DATABASE_URL (future)         │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Database (External)             │   │
│  │  - SQLite (current)              │   │
│  │  - PostgreSQL (recommended)      │   │
│  └──────────────────────────────────┘   │
│                                          │
└──────────────────────────────────────────┘
```

## Technology Stack Interaction

```
┌──────────────┐
│ React 19     │ ◄─── User interaction
├──────────────┤
│              │
│ Next.js 16   │ ◄─── SSR, routing, API
├──────────────┤
│              │
│ TypeScript   │ ◄─── Type safety
├──────────────┤
│              │
│ Tailwind     │ ◄─── Styling
│ CSS 4        │
├──────────────┤
│              │
│ GSAP 3       │ ◄─── Animations
├──────────────┤
│              │
│ JWT +        │ ◄─── Authentication
│ BCrypt       │
├──────────────┤
│              │
│ SQLite/      │ ◄─── Data persistence
│ PostgreSQL   │
└──────────────┘
```

---

**This architecture ensures security, performance, and scalability for your attendance system.**
