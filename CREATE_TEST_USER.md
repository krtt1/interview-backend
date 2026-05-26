# 🔐 สร้าง Test User สำหรับ Login

## ❌ ปัญหาปัจจุบัน

API login ขึ้น error:
```
"message": "Access denied for user 'root'@'10.219.177.72' (using password: YES)"
```

**สาเหตุ:** ไม่มีข้อมูล employee ในฐานข้อมูล Railway

---

## ✅ วิธีแก้ไข

### Option 1: สร้าง Test User ผ่าน Local (แนะนำ)

1. **ตรวจสอบ .env ของ local**
   ```
   MYSQL_PUBLIC_URL=mysql://root:@localhost:3307/odpc1
   ```

2. **รัน script สร้าง test user**
   ```bash
   node scripts/createTestUser.js
   ```

3. **ผลที่คาดหวัง**
   ```
   ✅ เชื่อมต่อ Database สำเร็จ
   ✅ สร้าง Test User สำเร็จ!

   📋 ข้อมูล Test User:
      ID: 0123456789123
      Email: test@example.com
      ชื่อ: ทดสอบ ระบบ
      Role: user

   🔐 ข้อมูลเข้าสู่ระบบ:
      ID: 0123456789123
      Password: 1234
   ```

4. **ทดสอบ login ใน Postman**
   ```json
   POST /api/employees/login
   {
     "id": "0123456789123",
     "password": "1234"
   }
   ```

---

### Option 2: สร้าง Test User ใน Railway (ถ้า local ไม่ได้)

1. **เพิ่ม script ใน package.json**
   ```json
   "scripts": {
     "create:test-user": "node scripts/createTestUser.js"
   }
   ```

2. **ใน Railway Dashboard → Settings → Build Command**
   ```bash
   npm run create:test-user
   ```

3. **Deploy ใหม่**

---

## 🧪 ทดสอบ Login

### ใน Postman:

**URL:**
```
POST https://interview-backend-production-630d.up.railway.app/api/employees/login
```

**Body (raw JSON):**
```json
{
  "id": "0123456789123",
  "password": "1234"
}
```

**ผลที่คาดหวัง:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "0123456789123",
    "role": "user",
    "name": "ทดสอบ"
  }
}
```

---

## 📋 Checklist

- [ ] รัน `node scripts/createTestUser.js` ใน local
- [ ] ตรวจสอบว่า test user สร้างสำเร็จ
- [ ] ทดสอบ login ใน Postman
- [ ] ได้ token สำเร็จ

---

## 🔍 Debugging

### ถ้า error "ER_DUP_ENTRY"
- User นี้มีอยู่แล้ว script จะ update แทน

### ถ้า error "ER_ACCESS_DENIED_ERROR"
- ตรวจสอบ MYSQL_PUBLIC_URL ถูกต้องหรือไม่

### ถ้า error "ER_NO_REFERENCED_TABLE"
- ต้องสร้าง job_title, position_level, position_type, job_group ก่อน
- ลองเปลี่ยน ID เป็น 1 แทน

---

## 📚 ข้อมูล Test User

| Field | Value |
|-------|-------|
| ID | 0123456789123 |
| Password | 1234 |
| Name | ทดสอบ ระบบ |
| Email | test@example.com |
| Role | user |
| Status | ปฏิบัติหน้าที่ |
