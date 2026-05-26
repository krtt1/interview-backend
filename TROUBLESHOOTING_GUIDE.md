# 🔧 Troubleshooting Guide

## 🚨 Common Issues & Solutions

---

## 1. Backend Won't Start

### Error: "EADDRINUSE: address already in use :::3011"

**Cause**: Port 3011 is already in use

**Solutions**:
```bash
# Option 1: Kill process on port 3011
# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3011).OwningProcess | Stop-Process -Force

# Option 2: Use different port
# Edit .env and change PORT=3012
# Then restart: npm run dev

# Option 3: Find what's using the port
netstat -ano | findstr :3011
```

---

## 2. Database Connection Failed

### Error: "Can't connect to MySQL server on 'localhost:3307'"

**Cause**: MySQL not running or wrong port

**Solutions**:
```bash
# 1. Verify MySQL is running
# Check XAMPP Control Panel - MySQL should be "Running"

# 2. Verify port 3307
# In XAMPP: Config > MySQL > my.ini
# Look for: port = 3307

# 3. Test connection
mysql -h localhost -P 3307 -u root

# 4. If still failing, restart MySQL
# XAMPP Control Panel > MySQL > Stop > Start

# 5. Check .env file
# Should be: MYSQL_PUBLIC_URL=mysql://root:@localhost:3307/odpc1
```

---

## 3. Database Doesn't Exist

### Error: "Unknown database 'odpc1'"

**Cause**: Database not created

**Solutions**:
```bash
# 1. Create database manually
mysql -h localhost -P 3307 -u root -e "CREATE DATABASE odpc1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Or reset database
npm run reset:db

# 3. Verify database exists
mysql -h localhost -P 3307 -u root -e "SHOW DATABASES;"
```

---

## 4. Dropdowns Empty

### Issue: Dropdown fields show no data

**Cause**: Mock data not seeded

**Solutions**:
```bash
# 1. Seed mock data
npm run seed:mock

# 2. Verify data in database
mysql -h localhost -P 3307 -u root -e "SELECT * FROM odpc1.tb_job_title;"

# 3. Check API response
curl http://localhost:3011/job-title/public/getall

# 4. If still empty, reset and reseed
npm run reset:db
npm run seed:mock
```

---

## 5. CORS Error in Browser

### Error: "Access to XMLHttpRequest blocked by CORS policy"

**Cause**: Frontend port not in ALLOWED_ORIGINS

**Solutions**:
```bash
# 1. Check current ALLOWED_ORIGINS in .env
# Should include your frontend port

# 2. Update .env if needed
# Example for port 3000:
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000

# 3. Restart backend
npm run dev

# 4. Clear browser cache (Ctrl+Shift+Delete)

# 5. Test with curl (should work)
curl http://localhost:3011/job-title/public/getall
```

---

## 6. Foreign Key Error on Startup

### Error: "Can't DROP FOREIGN KEY 'tb_employee_ibfk_9'"

**Cause**: Sequelize trying to alter schema

**Solutions**:
```bash
# Already fixed in index.js
# Verify line ~25 has:
# await sequelize.sync({ alter: false, force: false });

# If error persists:
# 1. Reset database
npm run reset:db

# 2. Restart backend
npm run dev
```

---

## 7. Row Size Too Large Error

### Error: "Row size too large (> 8126)"

**Cause**: Too many VARCHAR columns in capacity table

**Solutions**:
```bash
# Already fixed in models/capacity.js
# All VARCHAR columns converted to TEXT

# If error persists:
# 1. Check models/capacity.js
# 2. Verify all columns are TEXT type
# 3. Reset database
npm run reset:db

# 4. Restart backend
npm run dev
```

---

## 8. Thai Text Shows as ???

### Issue: Thai characters display incorrectly

**Cause**: Wrong character encoding

**Solutions**:
```bash
# 1. Verify database charset
mysql -h localhost -P 3307 -u root -e "SELECT @@character_set_database, @@collation_database;"

# Should show: utf8mb4, utf8mb4_unicode_ci

# 2. If wrong, recreate database
mysql -h localhost -P 3307 -u root -e "DROP DATABASE odpc1; CREATE DATABASE odpc1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 3. Reset and reseed
npm run reset:db
npm run seed:mock

# 4. Verify in browser
curl http://localhost:3011/job-title/public/getall
```

---

## 9. Package.json Encoding Error

### Error: "Unexpected token in JSON"

**Cause**: File encoding corruption

**Solutions**:
```bash
# 1. Verify package.json is UTF-8
# In VS Code: Bottom right > UTF-8

# 2. If corrupted, recreate file
# Copy content from backup or recreate manually

# 3. Reinstall dependencies
npm install

# 4. Verify package.json is valid
npm list
```

---

## 10. API Returns 500 Error

### Error: "Internal Server Error"

**Cause**: Various backend issues

**Solutions**:
```bash
# 1. Check backend logs
# Look for error messages in terminal

# 2. Test health endpoint
curl http://localhost:3011/api/health

# 3. Verify database connection
# Check if database is running

# 4. Check specific endpoint
curl http://localhost:3011/job-title/public/getall

# 5. Enable debug logging
# Edit .env: LOG_LEVEL=debug
# Restart: npm run dev

# 6. Check browser console for details
# F12 > Console tab
```

---

## 11. Cannot Find Module

### Error: "Cannot find module 'express'"

**Cause**: Dependencies not installed

**Solutions**:
```bash
# 1. Install dependencies
npm install

# 2. Verify node_modules exists
dir node_modules

# 3. Clear npm cache
npm cache clean --force

# 4. Reinstall
rm -r node_modules package-lock.json
npm install

# 5. Verify Node.js version
node --version
# Should be v14 or higher
```

---

## 12. Port Already in Use

### Error: "EADDRINUSE: address already in use"

**Cause**: Another process using the port

**Solutions**:
```bash
# Windows - Find and kill process
netstat -ano | findstr :3011
taskkill /PID <PID> /F

# Or use different port
# Edit .env: PORT=3012
# Restart: npm run dev

# Or use PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3011).OwningProcess | Stop-Process -Force
```

---

## 13. Nodemon Not Reloading

### Issue: Changes not reflected when saving files

**Cause**: Nodemon not watching files

**Solutions**:
```bash
# 1. Restart nodemon
# Ctrl+C to stop
# npm run dev to restart

# 2. Check nodemon is installed
npm list nodemon

# 3. Reinstall nodemon
npm install --save-dev nodemon

# 4. Verify nodemon config
# Check package.json has: "dev": "nodemon index.js"

# 5. Check file permissions
# Ensure files are readable
```

---

## 14. JWT Token Issues

### Error: "Invalid token" or "Token expired"

**Cause**: JWT configuration or token issues

**Solutions**:
```bash
# 1. Verify JWT_SECRET in .env
# Should be set to a secure value

# 2. Check token format
# Should be: Bearer <token>

# 3. Verify token not expired
# Tokens expire after set time

# 4. Clear browser storage
# F12 > Application > Clear Storage

# 5. Re-login to get new token
```

---

## 15. File Upload Issues

### Error: "File upload failed" or "Multer error"

**Cause**: Upload middleware configuration

**Solutions**:
```bash
# 1. Verify uploads directory exists
mkdir uploads

# 2. Check file permissions
# Ensure uploads folder is writable

# 3. Verify file size limit
# Check middleware/upload.js

# 4. Check file type restrictions
# Verify allowed file types

# 5. Test with curl
curl -F "file=@test.xlsx" http://localhost:3011/api/capacity/import
```

---

## 🔍 Debugging Steps

### Step 1: Check Backend Logs
```bash
# Look at terminal output when running:
npm run dev

# Should see:
# ✅ Database connected successfully
# ✅ Tables synced successfully
# 🚀 Server running on port 3011
```

### Step 2: Test Health Endpoint
```bash
curl http://localhost:3011/api/health

# Should return:
# {
#   "status": "ok",
#   "database": { "status": "connected" }
# }
```

### Step 3: Test Dropdown Endpoints
```bash
curl http://localhost:3011/job-title/public/getall

# Should return array of job titles
```

### Step 4: Check Browser Console
```
F12 > Console tab
Look for error messages
Check Network tab for failed requests
```

### Step 5: Check Database
```bash
# Connect to database
mysql -h localhost -P 3307 -u root

# Use database
USE odpc1;

# Check tables
SHOW TABLES;

# Check data
SELECT * FROM tb_job_title;
```

---

## 📋 Diagnostic Checklist

- [ ] Node.js installed (v14+)
- [ ] MySQL running on port 3307
- [ ] Database `odpc1` exists
- [ ] `.env` file configured correctly
- [ ] `node_modules` directory exists
- [ ] Backend running on port 3011
- [ ] Mock data seeded
- [ ] Dropdowns returning data
- [ ] CORS configured for frontend port
- [ ] No errors in backend logs
- [ ] Health check endpoint working
- [ ] Browser console has no errors

---

## 🆘 Emergency Reset

If everything is broken, do a complete reset:

```bash
# 1. Stop backend
# Ctrl+C in terminal

# 2. Reset database
npm run reset:db

# 3. Reinstall dependencies
npm install

# 4. Seed mock data
npm run seed:mock

# 5. Start backend
npm run dev

# 6. Test endpoints
curl http://localhost:3011/api/health
curl http://localhost:3011/job-title/public/getall
```

---

## 📞 Getting Help

If issue persists:

1. **Check logs**: Look at backend terminal output
2. **Check browser console**: F12 > Console
3. **Check network**: F12 > Network tab
4. **Test with curl**: Verify API works
5. **Check database**: Verify data exists
6. **Restart everything**: Backend, MySQL, browser

---

## 📝 Useful Commands

```bash
# Start backend
npm run dev

# Reset database
npm run reset:db

# Seed mock data
npm run seed:mock

# Create new user
npm run create:user

# Test endpoints
curl http://localhost:3011/job-title/public/getall
curl http://localhost:3011/api/health

# Check MySQL
mysql -h localhost -P 3307 -u root

# Check port usage
netstat -ano | findstr :3011

# Kill process on port
taskkill /PID <PID> /F
```

---

**Last Updated**: May 26, 2026
**Version**: 1.0.0
