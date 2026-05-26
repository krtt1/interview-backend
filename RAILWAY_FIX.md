# 🚂 Railway Database Connection Fix

## ❌ ปัญหา

```
Access denied for user 'root'@'10.156.104.195' (using password: YES)
```

**สาเหตุ:** MYSQL_PUBLIC_URL ใน Railway ยังใช้ค่าเก่า

---

## ✅ วิธีแก้ไข (ทำตามนี้เลย)

### Step 1: ไปที่ Railway Dashboard

1. เข้า https://railway.app
2. เลือก Project: `interview-backend`
3. เลือก Backend Service
4. ไปที่ **Variables** tab

### Step 2: แก้ไข MYSQL_PUBLIC_URL

**ลบค่าเก่า** แล้ว **ใส่ค่าใหม่:**

```
mysql://root:IGkoiDfcbvrdUKkemKqAwiKmkEvLoEwS@mysql.railway.internal:3306/railway
```

**ตรวจสอบ:**
- Username: `root`
- Password: `IGkoiDfcbvrdUKkemKqAwiKmkEvLoEwS`
- Host: `mysql.railway.internal`
- Port: `3306`
- Database: `railway`

### Step 3: บันทึก

Railway จะ auto-deploy ใน 1-2 นาที

### Step 4: ทดสอบ

```
POST https://interview-backend-production-630d.up.railway.app/api/employees/public/create-test-user
```

ผลที่คาดหวัง:
```json
{
  "message": "Test user created successfully",
  "user": {
    "id": "0123456789123",
    "email": "test@example.com",
    "name": "ทดสอบ",
    "password": "1234"
  }
}
```

---

## 🔍 ถ้ายังไม่ได้

ลองดู Railway Logs ว่า:
```
✅ Database connected successfully
```

ถ้าเห็นนี้ ก็ลองทดสอบ login:

```
POST https://interview-backend-production-630d.up.railway.app/api/employees/login
Body: {"id":"0123456789123","password":"1234"}
```

---

## 📌 สำคัญ!

**ต้องแก้ใน Railway Dashboard เท่านั้น** ไม่ใช่ใน code

Code ใน `.env.production` ถูกต้องแล้ว
