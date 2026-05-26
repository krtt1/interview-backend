# 🚀 Railway Setup - Step by Step

## ❌ ปัญหาปัจจุบัน

```
Access denied for user 'root'@'10.199.77.239' (using password: YES)
```

## ✅ วิธีแก้ (ทำตามขั้นตอน)

### Step 1: เข้า Railway Dashboard
```
https://railway.app
```

### Step 2: ตรวจสอบ MySQL Plugin

1. ไปที่ Project ของคุณ
2. ดู "Plugins" หรือ "Services"
3. หา MySQL Plugin
4. คลิกเข้าไป

### Step 3: ดู MySQL Variables

1. ในหน้า MySQL Plugin
2. ไปที่ "Variables" tab
3. ตรวจสอบว่ามี:
   - `MYSQL_PUBLIC_URL` ✅
   - `MYSQL_USER` ✅
   - `MYSQL_PASSWORD` ✅
   - `MYSQL_DB` ✅

**ตัวอย่าง**:
```
MYSQL_PUBLIC_URL=mysql://root:password@mysql.railway.internal:3306/railway
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DB=railway
```

### Step 4: Copy MYSQL_PUBLIC_URL

1. ดู `MYSQL_PUBLIC_URL` ใน MySQL Plugin
2. Copy ค่าทั้งหมด
3. เก็บไว้ (จะใช้ในขั้นตอนถัดไป)

### Step 5: ไปที่ Backend Service

1. ไปที่ Project ของคุณ
2. หา "Backend Service" หรือ "odpc1"
3. คลิกเข้าไป

### Step 6: ตั้งค่า Backend Variables

1. ในหน้า Backend Service
2. ไปที่ "Variables" tab
3. ตรวจสอบ/เพิ่ม:

```
NODE_ENV=production
PORT=3011
JWT_SECRET=my_super_secret_key_2026_xyz
MYSQL_PUBLIC_URL=<paste ค่าจาก MySQL Plugin>
ALLOWED_ORIGINS=https://interview-frontend-pnh8r2me2-krtt1s-projects.vercel.app
```

### Step 7: Link MySQL Plugin (ถ้ายังไม่ได้)

1. ในหน้า Backend Service
2. ไปที่ "Plugins" tab
3. ตรวจสอบว่า MySQL Plugin ถูก link หรือไม่
4. ถ้าไม่ ให้ "Add Plugin" → เลือก MySQL

### Step 8: Redeploy Backend

1. ในหน้า Backend Service
2. ไปที่ "Deployments" tab
3. คลิก "Redeploy" button
4. รอให้ deployment เสร็จ (2-5 นาที)

### Step 9: ตรวจสอบ Logs

1. ในหน้า Backend Service
2. ไปที่ "Logs" tab
3. ตรวจสอบว่ามี:
   - `✅ Database connected successfully` ✅
   - หรือ `❌ DB Connect Error` ❌

---

## 🧪 ทดสอบ

### ทดสอบ Health Check
```bash
curl https://interview-backend-production-630d.up.railway.app/api/health
```

### ตรวจสอบ Response
```json
{
  "status": "ok",
  "database": {
    "status": "connected"  // ✅ ถ้าสำเร็จ
  }
}
```

---

## 📸 ตัวอย่างภาพ

### MySQL Plugin Variables
```
MYSQL_PUBLIC_URL = mysql://root:abc123@mysql.railway.internal:3306/railway
MYSQL_USER = root
MYSQL_PASSWORD = abc123
MYSQL_DB = railway
```

### Backend Service Variables
```
NODE_ENV = production
PORT = 3011
JWT_SECRET = my_super_secret_key_2026_xyz
MYSQL_PUBLIC_URL = mysql://root:abc123@mysql.railway.internal:3306/railway
ALLOWED_ORIGINS = https://interview-frontend-pnh8r2me2-krtt1s-projects.vercel.app
```

---

## ⚠️ สำคัญ

1. **ไม่ต้อง commit password** - ตั้งค่าใน Railway Dashboard แทน
2. **ใช้ `mysql.railway.internal`** - ไม่ใช้ IP address
3. **Port คือ 3306** - MySQL default port
4. **Database name คือ `railway`** - ตรวจสอบให้แน่ใจ

---

## 🔄 ถ้ายังไม่ได้

ตอนนี้ backend ยังทำงานได้:
- ✅ Login ทำงาน (test user)
- ✅ Public endpoints ทำงาน (mock data)
- ✅ Frontend สามารถโหลดได้

เมื่อ database เชื่อมต่อได้ จะใช้ real data อัตโนมัติ

---

## 📞 ถ้าติดปัญหา

1. ตรวจสอบ Railway Logs
2. ตรวจสอบ Variables ถูกต้องหรือไม่
3. ตรวจสอบ MySQL Plugin ถูก link หรือไม่
4. ลอง Redeploy อีกครั้ง
5. ตรวจสอบ Health Check endpoint

---

**Status**: ⏳ รอการตั้งค่า Railway Dashboard
