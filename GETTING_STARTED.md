# Anwesenheit - Getting Started

Welcome! Your complete attendance management system is ready. Here's how to get started.

## 📁 Project Structure

```
Anwesenheit/
└── app/                          # Main application (Next.js)
    ├── app/                      # Application pages & routes
    ├── components/               # React components
    ├── lib/                      # Utilities & database
    ├── package.json              # Dependencies
    ├── README.md                 # User guide
    ├── DEPLOYMENT.md             # How to deploy
    └── PROJECT_SUMMARY.md        # Technical details
```

## 🚀 Quick Start (Local Development)

### 1. Navigate to project
```bash
cd app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

### 4. Open in browser
Visit: **http://localhost:3000**

### 5. Create first account
- Go to Sign Up page
- Don't enter an invite code (makes you admin)
- Login and explore admin dashboard

## 📋 Initial Setup Checklist

- [ ] Run `npm install`
- [ ] Start dev server with `npm run dev`
- [ ] Create first admin account
- [ ] Test worker check-in/check-out
- [ ] Explore admin dashboard
- [ ] Generate a test invite code
- [ ] Create worker account with invite

## 🔑 Key Features to Try

### Login Page (`/`)
- Simple, clean interface
- Animated background
- Login with any created account

### Worker Dashboard (`/worker`)
- Check-in button (green)
- Check-out button (red)
- Session duration display
- Status indicator

### Admin Dashboard (`/admin`)
- Overview tab: Statistics cards
- Sessions tab: Currently online users
- Leaderboard tab: Top workers by hours
- Invite Admin button: Generate access codes

### Authentication
- Email/password required
- BCrypt password hashing
- JWT token-based
- 24-hour session expiration

## 📱 Test Users

After starting, create:
1. **Admin Account**: Sign up without invite code
2. **Worker Account**: Sign up and use admin-generated invite code
3. Or just use same account for testing all roles

## 🔐 Security Features

✅ Password hashing (BCrypt 12 rounds)
✅ JWT authentication
✅ HTTP-only cookies
✅ CSRF protection
✅ Role-based access control
✅ Type-safe TypeScript

## 🎨 Animations

- Background particle effects
- Button scale animations
- Card fade-in effects
- Modal slide-in transitions
- All powered by GSAP library

## 📊 Admin Dashboard Stats

- **Total Users**: Count of all worker accounts
- **Administrators**: Count of admin accounts
- **Total Sessions**: Count of all check-in/out pairs
- **Total Hours**: Sum of all logged hours
- **Currently Online**: Live session count

## 🏭 Use Cases

### Factory Floor
1. Workers scan NFC/press button on arrival
2. Workers scan NFC/press button at departure
3. Admin monitors live attendance
4. Admin checks leaderboard for hours worked

### Office
1. Employees check-in via web browser
2. See who's currently online
3. Admin tracks work hours
4. Generate attendance reports

### Remote Teams
1. Team members check-in/out remotely
2. Flexible schedule tracking
3. Manager overview of activity
4. Time tracking for billing

## 🔧 Configuration

Edit `.env.local` in the `app` directory:

```env
JWT_SECRET=your-secure-key (change this!)
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL=file:./dev.db
```

## 📚 Documentation

Read these files in order:
1. **README.md** - Features and tech stack
2. **PROJECT_SUMMARY.md** - Architecture and API
3. **DEPLOYMENT.md** - How to deploy to Vercel

## 🚢 Deployment to Vercel

Ready to go live? Follow these steps:

```bash
# 1. Commit your code
git add .
git commit -m "Initial commit"

# 2. Push to GitHub
git push origin main

# 3. Go to vercel.com/new
# 4. Import your GitHub repository
# 5. Add environment variables
# 6. Deploy!
```

See **DEPLOYMENT.md** for detailed instructions.

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
# Then visit http://localhost:3001
```

### Dependencies install fails
```bash
rm -rf node_modules package-lock.json
npm install
```

### Animations not working
- Check browser console for errors
- Verify GSAP is installed: `npm ls gsap`
- Try clearing browser cache

### Database issues
- Delete `dev.db` and restart server
- Check `.env.local` has correct DATABASE_URL

## 💡 Tips & Tricks

1. **Admin Account**: Required for inviting others
2. **Invite Codes**: 6-character random codes, single-use
3. **Session Tracking**: Duration calculated on checkout
4. **Leaderboard**: Sorted by total hours worked
5. **Animations**: Smooth 60 FPS throughout

## 🎯 Next Steps

1. ✅ Get the app running locally
2. ✅ Test all features
3. ✅ Customize colors/branding if needed
4. ✅ Deploy to Vercel
5. ✅ Set up admin accounts
6. ✅ Add worker accounts
7. ✅ Start tracking attendance!

## 📞 Need Help?

- Check **DEPLOYMENT.md** for deployment issues
- Review **PROJECT_SUMMARY.md** for architecture questions
- See **README.md** for features overview
- Check Next.js docs: https://nextjs.org/docs

## 🎉 You're All Set!

Your attendance management system is complete and ready to use. 

**Next: Run `npm run dev` and enjoy! 🚀**

---

**Questions?** See the documentation files in the app directory.
