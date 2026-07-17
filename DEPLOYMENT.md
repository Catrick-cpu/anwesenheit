# Deployment Guide for Anwesenheit

## Prerequisites

Before deploying to Vercel, ensure you have:
- A GitHub account with your repository pushed
- A Vercel account (free tier available)
- Node.js 20+ (for local testing before deployment)

## Step 1: Prepare Your GitHub Repository

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Anwesenheit attendance system"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/anwesenheit.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Recommended)

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts to:
1. Select your project
2. Link to your GitHub repository
3. Configure build settings
4. Add environment variables

### Option B: Vercel Dashboard

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Click "Import"
5. Configure settings (see below)
6. Click "Deploy"

## Step 3: Configure Environment Variables

On Vercel dashboard, go to **Settings → Environment Variables** and add:

### Required Variables

**JWT_SECRET** (Critical for security)
```
Generate a secure random string:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Paste the output as the JWT_SECRET value.

**NEXT_PUBLIC_API_URL**
After deployment, your URL will be: `https://your-project-name.vercel.app`
Set this as the NEXT_PUBLIC_API_URL.

### Example Setup

| Key | Value |
|-----|-------|
| JWT_SECRET | (your generated hex string) |
| NEXT_PUBLIC_API_URL | https://your-project-name.vercel.app |

## Step 4: Database Configuration

### SQLite (Development/Small Scale)
Vercel supports SQLite, but data is ephemeral (resets on redeployment).

### PostgreSQL (Production Recommended)

For production, switch to PostgreSQL:

1. **Get a PostgreSQL database** (options):
   - Vercel PostgreSQL (recommended)
   - Supabase.com (free tier available)
   - Railway.app
   - AWS RDS

2. **Install Prisma** (simpler than current setup):
```bash
npm install prisma @prisma/client
npx prisma init
```

3. **Update `lib/db.ts`** to use PostgreSQL:
```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

4. **Add DATABASE_URL** to Vercel environment variables with your PostgreSQL connection string

## Step 5: Deploy

### Via CLI
```bash
vercel --prod
```

### Via Dashboard
Click "Deploy" button

### Verify Deployment
Visit `https://your-project-name.vercel.app`

## Step 6: Post-Deployment

### Create First Admin Account
1. Go to your deployed URL
2. Click "Create Account"
3. Leave "Admin Invite Code" empty
4. Sign up (you become the first admin)
5. Generate invite codes from admin dashboard

### Test Features
- [ ] Login works
- [ ] Create new worker account
- [ ] Check-in/check-out buttons work
- [ ] Admin dashboard loads
- [ ] Admin can generate invites
- [ ] Animations are smooth

## Troubleshooting

### Build Fails
**Error: "Node.js 18 is not supported"**
- Vercel uses Node.js 20+ by default ✓

**Error: "Cannot find module 'better-sqlite3'"**
- SQLite doesn't work on Vercel's serverless environment
- Switch to PostgreSQL (see above)

### Authentication Issues
**"Invalid credentials" on login**
- Check JWT_SECRET is set
- Verify user was created (check database)

**"Invalid token" after login**
- JWT_SECRET changed (regenerate and redeploy)
- Token expired (logout and login again)

### Database Issues
**"Database locked"**
- SQLite is being accessed by multiple processes
- Switch to PostgreSQL for production

**"Cannot create database"**
- Check file permissions
- Use PostgreSQL instead

## Production Checklist

- [ ] Generate strong JWT_SECRET
- [ ] Set NEXT_PUBLIC_API_URL correctly
- [ ] Switch to PostgreSQL database
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up database backups
- [ ] Monitor error logs
- [ ] Set up analytics
- [ ] Create privacy policy
- [ ] Test on mobile devices
- [ ] Load test with expected users

## Scaling Considerations

### Current Limits (SQLite)
- Suitable for: < 100 concurrent users
- Sessions per day: < 10,000
- Data storage: Limited by Vercel

### PostgreSQL Recommended For
- > 100 users
- > 50,000 sessions/day
- Long-term data storage
- High availability needs

## Monitoring

### Enable Vercel Analytics
1. Go to Vercel dashboard
2. Select your project
3. Go to Analytics tab
4. Enable "Web Analytics"

### Monitor Errors
1. Go to Deployments tab
2. Click latest deployment
3. View logs and errors

### Database Health
For PostgreSQL:
- Monitor connection pool usage
- Check query performance
- Set up automated backups

## Updating the Application

After making changes locally:

```bash
# Test locally
npm run dev

# Commit changes
git add .
git commit -m "Your message"

# Push to GitHub
git push origin main

# Vercel automatically redeploys!
```

## Support

For issues:
1. Check Vercel logs: Dashboard → Deployments → Logs
2. Review environment variables are set
3. Verify database connection
4. Check Next.js documentation

---

**Happy deploying! Your Anwesenheit system is now live.** 🚀
