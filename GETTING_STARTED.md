# 🚀 Getting Started with ODPC1

Welcome to ODPC1 - Employee Management & Capacity Planning System

---

## ⚡ Quick Start (5 minutes)

### 1. Prerequisites
- Node.js v14+ installed
- MySQL running on port 3307
- Database `odpc1` created

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# .env file is already configured
# Verify it has:
MYSQL_PUBLIC_URL=mysql://root:@localhost:3307/odpc1
PORT=3011
```

### 4. Start Backend
```bash
npm run dev
```

Expected output:
```
✅ Database connected successfully
✅ Tables synced successfully
🚀 Server running on port 3011
```

### 5. Seed Mock Data
```bash
npm run seed:mock
```

### 6. Test Endpoints
```bash
# In browser or terminal
curl http://localhost:3011/job-title/public/getall
```

**Done!** Backend is ready 🎉

---

## 📚 Documentation

### For Backend Developers
- **[BACKEND_SETUP_COMPLETE.md](./BACKEND_SETUP_COMPLETE.md)** - Complete backend setup
- **[API_TESTING_EXAMPLES.md](./API_TESTING_EXAMPLES.md)** - API testing guide
- **[TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)** - Troubleshooting

### For Frontend Developers
- **[FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)** - Frontend integration
- **[SYSTEM_SUMMARY.md](./SYSTEM_SUMMARY.md)** - System overview

### For DevOps/Deployment
- **[DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md)** - Deployment guide
- **[LOCALHOST_SETUP.md](./LOCALHOST_SETUP.md)** - Local setup

### For Data Management
- **[MOCK_DATA_GUIDE.md](./MOCK_DATA_GUIDE.md)** - Mock data guide
- **[docs/CAPACITY_IMPORT_EXPORT_GUIDE.md](./docs/CAPACITY_IMPORT_EXPORT_GUIDE.md)** - Import/export

---

## 🎯 Common Tasks

### Start Development Server
```bash
npm run dev
```

### Reset Database
```bash
npm run reset:db
```

### Seed Mock Data
```bash
npm run seed:mock
```

### Create New User
```bash
npm run create:user
```

### Test API Endpoints
```bash
# Job Titles
curl http://localhost:3011/job-title/public/getall

# Position Levels
curl http://localhost:3011/position-level/public/getall

# Position Types
curl http://localhost:3011/position-type/public/getall

# Job Groups
curl http://localhost:3011/jobgroup/public/getall

# Health Check
curl http://localhost:3011/api/health
```

---

## 🔐 Test Credentials

Use these to test the system:

| Email | Password | Role |
|-------|----------|------|
| employee001@example.com | password123 | user |
| employee002@example.com | password123 | admin |
| admin@example.com | password123 | superadmin |

---

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│                   http://localhost:3000                  │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  Backend (Express.js)                    │
│                   http://localhost:3011                  │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Routes → Controllers → Services → Models        │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │ SQL
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  MySQL Database                         │
│              localhost:3307 (odpc1)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Employees, Capacity, Meetings, Commands, etc.  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
odpc1-deploy-main/
├── config/              # Database configuration
├── controllers/         # Request handlers
├── models/             # Database models
├── routes/             # API routes
├── services/           # Business logic
├── middleware/         # Express middleware
├── scripts/            # Utility scripts
├── docs/               # Documentation
├── .env                # Environment variables
├── package.json        # Dependencies
└── index.js            # Main server
```

---

## 🔌 API Endpoints

### Public (No Auth Required)
```
GET  /job-title/public/getall
GET  /position-level/public/getall
GET  /position-type/public/getall
GET  /jobgroup/public/getall
GET  /api/health
GET  /
```

### Protected (Auth Required)
```
GET    /api/employees
POST   /api/employees
GET    /api/employees/:id
PUT    /api/employees/:id
DELETE /api/employees/:id

GET    /api/capacity
POST   /api/capacity
GET    /api/capacity/:id
PUT    /api/capacity/:id
DELETE /api/capacity/:id

GET    /api/meeting
POST   /api/meeting
GET    /api/meeting/:id
PUT    /api/meeting/:id
DELETE /api/meeting/:id

GET    /api/command
POST   /api/command
GET    /api/command/:id
PUT    /api/command/:id
DELETE /api/command/:id
```

---

## 🧪 Testing

### Test with cURL
```bash
# Get job titles
curl http://localhost:3011/job-title/public/getall

# Get position levels
curl http://localhost:3011/position-level/public/getall

# Health check
curl http://localhost:3011/api/health
```

### Test with Postman
1. Import collection from docs
2. Set base URL: `http://localhost:3011`
3. Run requests

### Test with Browser
1. Open DevTools (F12)
2. Go to Console tab
3. Paste:
```javascript
fetch('http://localhost:3011/job-title/public/getall')
  .then(r => r.json())
  .then(data => console.log(data))
```

---

## 🔧 Configuration

### Environment Variables (.env)
```
# Database
MYSQL_PUBLIC_URL=mysql://root:@localhost:3307/odpc1

# Server
PORT=3011
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# JWT
JWT_SECRET=your-secret-key

# Database
DB_SSL=false

# Logging
LOG_LEVEL=debug
```

### Database Connection
- **Host**: localhost
- **Port**: 3307
- **Database**: odpc1
- **User**: root
- **Password**: (empty)
- **Charset**: utf8mb4

---

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start with auto-reload

# Production
npm run start            # Start server

# Database
npm run reset:db         # Reset database
npm run seed:mock        # Seed mock data

# User Management
npm run create:user      # Create new user
```

---

## 🚨 Troubleshooting

### Backend won't start?
1. Check MySQL is running on port 3307
2. Verify `.env` has correct database URL
3. Run `npm install`
4. Check Node.js version (v14+)

### Dropdowns empty?
1. Run `npm run seed:mock`
2. Verify data in database
3. Check API response in browser

### CORS error?
1. Verify frontend port in `.env` ALLOWED_ORIGINS
2. Restart backend after changing `.env`
3. Clear browser cache

**See [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md) for more help**

---

## 📝 Next Steps

### For Backend Development
1. Review [BACKEND_SETUP_COMPLETE.md](./BACKEND_SETUP_COMPLETE.md)
2. Check [API_TESTING_EXAMPLES.md](./API_TESTING_EXAMPLES.md)
3. Explore controllers and services

### For Frontend Development
1. Read [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)
2. Test endpoints with cURL
3. Integrate with Next.js

### For Deployment
1. Review [DEPLOY_INSTRUCTIONS.md](./DEPLOY_INSTRUCTIONS.md)
2. Set up production environment
3. Configure database backup

---

## 📞 Support

### Quick Help
- **Backend Issues**: Check [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)
- **API Questions**: See [API_TESTING_EXAMPLES.md](./API_TESTING_EXAMPLES.md)
- **Frontend Help**: Read [FRONTEND_INTEGRATION_GUIDE.md](./FRONTEND_INTEGRATION_GUIDE.md)
- **System Overview**: Check [SYSTEM_SUMMARY.md](./SYSTEM_SUMMARY.md)

### Useful Commands
```bash
# Check backend status
curl http://localhost:3011/api/health

# Check database
mysql -h localhost -P 3307 -u root

# View logs
npm run dev

# Reset everything
npm run reset:db && npm run seed:mock
```

---

## ✅ Verification Checklist

- [ ] Node.js v14+ installed
- [ ] MySQL running on port 3307
- [ ] Database `odpc1` created
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] Backend starts (`npm run dev`)
- [ ] Mock data seeded (`npm run seed:mock`)
- [ ] Endpoints respond (`curl http://localhost:3011/job-title/public/getall`)
- [ ] Health check works (`curl http://localhost:3011/api/health`)
- [ ] No errors in logs

---

## 🎓 Learning Resources

### Backend
- Express.js: https://expressjs.com
- Sequelize: https://sequelize.org
- MySQL: https://dev.mysql.com

### Frontend
- Next.js: https://nextjs.org
- React: https://react.dev
- Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API

### DevOps
- Docker: https://www.docker.com
- Render: https://render.com
- GitHub Actions: https://github.com/features/actions

---

## 📄 License

This project is part of the Thai Ministry of Public Health ODPC1 system.

---

## 🎉 You're All Set!

Your ODPC1 backend is ready to go. Start developing! 🚀

**Questions?** Check the documentation files or see [TROUBLESHOOTING_GUIDE.md](./TROUBLESHOOTING_GUIDE.md)

---

**Last Updated**: May 26, 2026
**Status**: ✅ Ready for Development
**Version**: 1.0.0
