# 🚂 Railway Setup Guide

## ❌ ปัญหาปัจจุบัน

HTTP 500 Error เกิดจากการขาดการตั้งค่า environment variables ใน Railway

### สาเหตุ:
1. Code ใช้ `MYSQL_PUBLIC_URL` เพื่อเชื่อมต่อ MySQL
2. `.env.production` ไม่มี `MYSQL_PUBLIC_URL` 
3. Railway ไม่มีการตั้งค่า environment variables ที่ถูกต้อง

---

## ✅ วิธีแก้ไข

### Step 1: ไปที่ Railway Dashboard
1. เข้า https://railway.app
2. เลือก Project ของคุณ
3. เลือก Service (Backend)

### Step 2: ตั้งค่า Environment Variables

ใน Railway Dashboard → Variables → เพิ่ม variables ต่อไปนี้:

```
NODE_ENV=production
PORT=3011
MYSQL_PUBLIC_URL=mysql://username:password@host:port/database
JWT_SECRET=your-super-secret-jwt-key-change-this
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### Step 3: ตัวอย่างการตั้งค่า

ถ้าคุณใช้ MySQL บน Railway:

1. **สร้าง MySQL Plugin ใน Railway**
   - ไปที่ Railway Dashboard
   - คลิก "Create" → "Database" → "MySQL"
   - Railway จะสร้าง MySQL instance ให้

2. **ดึง Connection String**
   - ไปที่ MySQL Plugin
   - ดู "Variables" tab
   - คัดลอก `DATABASE_URL` หรือสร้าง URL เอง:
   ```
   mysql://root:password@host:port/database
   ```

3. **ตั้งค่า MYSQL_PUBLIC_URL ใน Backend Service**
   - ไปที่ Backend Service → Variables
   - เพิ่ม `MYSQL_PUBLIC_URL` = `mysql://root:password@host:port/database`

### Step 4: Deploy

Railway จะ auto-deploy เมื่อคุณ push ไป main branch

---

## 🧪 ทดสอบ

### ตรวจสอบ Health Check
```bash
curl https://interview-backend-production-630d.up.railway.app/api/health
```

ผลที่คาดหวัง:
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2024-05-26T10:30:00.000Z",
  "database": {
    "status": "connected"
  }
}
```

### ทดสอบ Login
```bash
curl -X POST https://interview-backend-production-630d.up.railway.app/api/employees/login \
  -H "Content-Type: application/json" \
  -d '{"id":"E001","password":"password123"}'
```

---

## 📋 Checklist

- [ ] Railway MySQL Plugin สร้างแล้ว
- [ ] `MYSQL_PUBLIC_URL` ตั้งค่าใน Railway Variables
- [ ] `JWT_SECRET` ตั้งค่าใน Railway Variables
- [ ] `NODE_ENV=production` ตั้งค่าแล้ว
- [ ] Deploy สำเร็จ (ดู Railway Logs)
- [ ] Health Check ทำงาน
- [ ] Login API ทำงาน

---

## 🔍 Debugging

### ดู Railway Logs
1. ไปที่ Railway Dashboard
2. เลือก Backend Service
3. ดู "Logs" tab
4. ค้นหา error message

### Common Errors

**Error: MYSQL_PUBLIC_URL is not defined**
- ✅ ตั้งค่า `MYSQL_PUBLIC_URL` ใน Railway Variables

**Error: connect ECONNREFUSED**
- ✅ ตรวจสอบว่า MySQL Plugin ทำงานหรือไม่
- ✅ ตรวจสอบ connection string ถูกต้องหรือไม่

**Error: ER_ACCESS_DENIED_ERROR**
- ✅ ตรวจสอบ username/password ถูกต้องหรือไม่

---

## 📚 Reference

- Railway Docs: https://docs.railway.app
- MySQL Connection String: https://dev.mysql.com/doc/connector-net/en/connector-net-connection-string.html
