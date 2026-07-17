# Quick Reference Card

## 🚀 Get Started (2 minutes)

```bash
cd app
npm install
npm run dev
# Open http://localhost:3000
```

## 🔑 First Time Setup

1. **Sign up without invite code** → Become admin
2. **Login** → Access admin dashboard
3. **Click "Invite Admin"** → Generate invite codes
4. **Share code** → Others sign up as admin/worker

## 📍 URL Routes

| Path | Purpose | Who |
|------|---------|-----|
| `/` | Login page | Everyone |
| `/signup` | Create account | New users |
| `/worker` | Check-in/out | Workers |
| `/admin` | Dashboard | Admins |

## 🔐 Test Accounts

Create any email/password:
- **Admin**: Signup without invite code
- **Worker**: Signup with admin-generated code
- **Both**: Can check-in/out, but admin has dashboard

## 📊 Admin Dashboard Tabs

| Tab | Shows |
|-----|-------|
| **Overview** | Stats cards (users, sessions, hours, online) |
| **Sessions** | Currently online users |
| **Leaderboard** | Top workers by hours |

## 🎯 Common Tasks

### I want to...

**Add a new admin user**
1. Login as admin
2. Click "Invite Admin"
3. Enter their email
4. Share the invite code
5. They sign up with the code

**Check worker hours**
1. Go to admin dashboard
2. Click "Leaderboard" tab
3. See total hours by worker

**See who's online**
1. Go to admin dashboard
2. Click "Sessions" tab
3. See current active sessions

**Worker login**
1. Go to `/signup`
2. Enter email, password, name
3. Paste invite code (if required)
4. Go to `/worker`
5. Click check-in/out

## ⚙️ Configuration

Edit `app/.env.local`:
```
JWT_SECRET=your-secret
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
```

## 🚢 Deploy to Vercel

```bash
# 1. Push code
git push origin main

# 2. Go to vercel.com/new
# 3. Import GitHub repo
# 4. Add env vars:
#    JWT_SECRET = random 32+ chars
#    NEXT_PUBLIC_API_URL = your vercel domain
# 5. Click Deploy
```

## 📁 Key Files

| File | Purpose |
|------|---------|
| `app/app/page.tsx` | Login page |
| `app/app/worker/page.tsx` | Worker dashboard |
| `app/app/admin/page.tsx` | Admin dashboard |
| `app/lib/auth.ts` | JWT & password utilities |
| `app/lib/users.ts` | Database operations |
| `app/lib/db.ts` | Database setup |

## 🐛 Quick Fixes

**Port 3000 busy?**
```bash
npm run dev -- -p 3001
```

**Database error?**
```bash
rm app/dev.db && npm run dev
```

**Can't install?**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentation

| File | Read For |
|------|----------|
| `README.md` | Overview & features |
| `GETTING_STARTED.md` | Detailed setup |
| `app/README.md` | Feature guide |
| `app/DEPLOYMENT.md` | Deploy instructions |
| `app/PROJECT_SUMMARY.md` | Architecture & API |

## 🔒 Security Quick Tips

- ✅ BCrypt hashes passwords (never plain text)
- ✅ JWT tokens expire after 24 hours
- ✅ Cookies are HTTP-only (XSS safe)
- ✅ Invite codes are single-use
- ✅ All queries use parameterized statements

## 🎨 Animate Everything with GSAP

```typescript
import gsap from 'gsap';

gsap.to(element, {
  duration: 0.3,
  opacity: 1,
  y: 0,
  ease: 'back.out'
});
```

## 📊 Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User accounts & roles |
| `sessions` | Check-in/check-out records |
| `admin_invites` | Invitation codes |

## 🎯 Stats Available

- Total users
- Total admins
- Total sessions
- Total hours logged
- Currently online count

## 🔄 API Quick Calls

```javascript
// Login
POST /api/auth/login
{ email, password }

// Signup
POST /api/auth/signup
{ email, password, name, inviteCode? }

// Check-in
POST /api/sessions/checkin

// Check-out
POST /api/sessions/checkout

// Get stats
GET /api/admin/stats

// Invite admin
POST /api/admin/invite
{ email }
```

## ✅ Before Production

- [ ] Generate strong JWT_SECRET
- [ ] Set NEXT_PUBLIC_API_URL
- [ ] Test all auth flows
- [ ] Verify check-in/out works
- [ ] Test admin invite system
- [ ] Check responsive design
- [ ] Review security settings
- [ ] Deploy to Vercel
- [ ] Create test admin account
- [ ] Verify database persists

## 🎉 That's It!

You have everything you need. Start with:

```bash
cd app && npm install && npm run dev
```

Then read **GETTING_STARTED.md** for next steps.

---

**Built with ❤️ for secure, simple attendance tracking**
