# Anwesenheit - Attendance Management System

A modern, secure attendance management system built with Next.js, perfect for factories and large organizations. Simple check-in/check-out buttons for workers, comprehensive admin dashboard with GSAP animations.

## Features

✨ **Modern UI with GSAP Animations**
- Smooth, fluid animations throughout the application
- Responsive design that works on all devices
- Dark theme optimized for reduced eye strain

🔐 **Enterprise Security**
- BCrypt password hashing (salted 12 rounds)
- JWT-based authentication with 24-hour expiration
- HTTP-only secure cookies
- CSRF protection via SameSite cookies
- Role-based access control (RBAC)

👥 **User Management**
- Admin-only account creation via invite codes
- Worker accounts for factory floor
- Role-based dashboards
- Session tracking and history

📊 **Admin Dashboard**
- Real-time stats (total users, sessions, hours logged)
- Live online users tracking
- Leaderboard with total hours worked
- Session history with detailed logs

🏭 **Worker Interface**
- Simple one-click check-in/check-out
- Current session status display
- NFC-ready architecture for future integration

## Tech Stack

- **Framework**: Next.js 16 with TypeScript
- **Database**: SQLite (upgradeable to PostgreSQL)
- **Authentication**: JWT + BCrypt
- **Animations**: GSAP 3
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel

## Quick Start

### Local Development

```bash
npm install
npm run dev
```

Create `.env.local`:
```
JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables:
   - `JWT_SECRET` (random 32+ chars)
   - `NEXT_PUBLIC_API_URL` (your Vercel domain)
4. Deploy!

## API Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Create account
- `POST /api/sessions/checkin` - Start work session
- `POST /api/sessions/checkout` - End work session
- `GET /api/admin/stats` - Dashboard stats
- `POST /api/admin/invite` - Create admin invite

## Security

- ✅ BCrypt password hashing (12 rounds)
- ✅ JWT tokens with 24h expiration
- ✅ HTTP-only secure cookies
- ✅ CSRF protection (SameSite)
- ✅ Role-based access control
- ✅ Parameterized SQL queries
- ✅ Full TypeScript type safety

## First Setup

1. Sign up without invite code (becomes admin)
2. Admin generates invite codes
3. Workers sign up with invite (or regular signup)
4. Start tracking attendance!

## NFC Integration

The worker check-in page is ready for NFC. Replace the button click handler with your NFC reader library to read employee cards instead of manual clicks.

---

**Deploy with confidence. Enterprise-grade attendance tracking.**
