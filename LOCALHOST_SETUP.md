# 🚀 ODPC1 Backend - Localhost Setup Guide

## 📋 สรุปการตั้งค่า

ระบบหลังบ้าน ODPC1 ได้รับการปรับปรุงให้พร้อมใช้งานกับ Localhost MySQL ที่พอร์ต 3307 พร้อมข้อมูลสมมุติปลอดภัยตามกฎหมาย PDPA

---

## ✅ ขั้นตอนการตั้งค่า

### 1️⃣ **ตั้งค่าฐานข้อมูล MySQL Local**

**ข้อมูลการเชื่อมต่อ:**
- **Host:** localhost
- **Port:** 3307
- **User:** root
- **Password:** (ไม่มี)
- **Database:** odpc1

**ตรวจสอบใน Navicat:**
```
✓ MySQL Server ทำงานที่พอร์ต 3307
✓ ฐานข้อมูล "odpc1" ถูกสร้างแล้ว
✓ สามารถเชื่อมต่อได้ด้วย root user
```

---

### 2️⃣ **ไฟล์ .env สำหรับ Localhost**

ไฟล์ `.env` ได้ถูกสร้างแล้วที่ Root folder ของโปรเจกต์

**เนื้อหา:**
```env
# Database Configuration (MySQL on XAMPP - Port 3307)
MYSQL_PUBLIC_URL=mysql://root:@localhost:3307/odpc1

# Server Configuration
PORT=3011
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-in-production

# Database SSL
DB_SSL=false

# Logging
LOG_LEVEL=debug
```

**ตัวแปรสำคัญ:**
- `MYSQL_PUBLIC_URL` - ชี้ไปที่ MySQL Local ที่พอร์ต 3307
- `PORT` - Server ทำงานที่พอร์ต 3011
- `ALLOWED_ORIGINS` - อนุญาต CORS จาก Next.js (พอร์ต 3000)

---

### 3️⃣ **Auto Migration - สร้างตารางอัตโนมัติ**

ระบบได้ตั้งค่า `sequelize.sync()` ในไฟล์ `index.js` แล้ว

**วิธีการทำงาน:**
1. เมื่อรัน `npm run dev` ปุ๊บ
2. ระบบจะตรวจสอบการเชื่อมต่อฐานข้อมูล
3. สร้างตารางทั้งหมดอัตโนมัติ (ถ้ายังไม่มี)
4. ตารางจะปรากฏใน Navicat ทันที

**ตารางที่จะถูกสร้าง:**
- `tb_employee` - ข้อมูลพนักงาน
- `tb_job_title` - ประเภทบุคลากร
- `tb_position_level` - ระดับตำแหน่ง
- `tb_position_type` - ตำแหน่งในสายงาน
- `tb_job_group` - กลุ่มงาน
- `tb_meeting` - ข้อมูลการประชุม
- `tb_command` - ข้อมูลคำสั่ง
- `tb_capacity` - ข้อมูลความสามารถ
- และตารางอื่นๆ

---

### 4️⃣ **Anonymization - ข้อมูลสมมุติปลอดภัย**

สคริปต์ Mock Data ได้ถูกสร้างแล้ว เพื่อป้องกันการรั่วไหลข้อมูลส่วนบุคคล

**ข้อมูลสมมุติที่รวมอยู่:**
- 4 พนักงานตัวอย่าง (ชื่อสมมุติ)
- 3 ประเภทบุคลากร
- 5 ระดับตำแหน่ง
- 3 ตำแหน่งในสายงาน
- 4 กลุ่มงาน

**ข้อมูลพนักงานตัวอย่าง:**
```
ID: 1234567890001
ชื่อ: สมชาย ใจดี
Email: employee001@example.com
Password: password123 (hashed)
Role: user

ID: 1234567890002
ชื่อ: สมหญิง สุขสวัสดิ์
Email: employee002@example.com
Password: password123 (hashed)
Role: admin

ID: 1234567890003
ชื่อ: สมศักดิ์ เรียนรู้
Email: employee003@example.com
Password: password123 (hashed)
Role: user

ID: 1234567890004
ชื่อ: สมบูรณ์ ผู้บริหาร
Email: admin@example.com
Password: password123 (hashed)
Role: superadmin
```

---

## 🚀 วิธีการใช้งาน

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
npm install
```

### ขั้นตอนที่ 2: สร้างข้อมูลสมมุติ (Mock Data)

```bash
npm run seed:mock
```

**ผลลัพธ์:**
```
🌱 เริ่มสร้างข้อมูลสมมุติ...

✅ ตารางฐานข้อมูลพร้อมแล้ว

📝 สร้างข้อมูล Job Titles...
✅ สร้าง 3 รายการ Job Title

📝 สร้างข้อมูล Position Levels...
✅ สร้าง 5 รายการ Position Level

📝 สร้างข้อมูล Position Types...
✅ สร้าง 3 รายการ Position Type

📝 สร้างข้อมูล Job Groups...
✅ สร้าง 4 รายการ Job Group

📝 สร้างข้อมูลพนักงาน (Anonymized)...
✅ สร้าง 4 รายการพนักงาน

🎉 สร้างข้อมูลสมมุติเสร็จสิ้น!

📊 สรุปข้อมูล:
   - Job Titles: 3
   - Position Levels: 5
   - Position Types: 3
   - Job Groups: 4
   - Employees: 4

🔐 ข้อมูลทั้งหมดเป็นข้อมูลสมมุติ (Mock Data) ปลอดภัยตามกฎหมาย PDPA
```

### ขั้นตอนที่ 3: รัน Development Server

```bash
npm run dev
```

**ผลลัพธ์:**
```
✅ Database connected successfully
✅ Tables synced successfully
🚀 Server running on port 3011
🌍 Environment: development
📡 Health Check: /
📡 API Base: /api
```

### ขั้นตอนที่ 4: ทดสอบ API

```bash
# Health Check
curl http://localhost:3011/

# API Info
curl http://localhost:3011/api

# ดึงข้อมูลพนักงาน
curl http://localhost:3011/api/employees

# ดึงข้อมูลพนักงานคนเดียว
curl http://localhost:3011/api/employees/1234567890001
```

---

## ✅ ตรวจสอบ CORS

ระบบได้ตั้งค่า CORS ให้อนุญาต Next.js (พอร์ต 3000) แล้ว

**Allowed Origins:**
- `http://localhost:3000` ✅
- `http://localhost:3001` ✅
- `http://127.0.0.1:3000` ✅
- `https://hrodpc1.ddc.moph.go.th` ✅
- Vercel Preview Deployments ✅

**ตรวจสอบใน Browser Console:**
```javascript
// ทดสอบ CORS
fetch('http://localhost:3011/api/employees')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

---

## 📊 ตรวจสอบข้อมูลใน Navicat

1. เปิด Navicat
2. เชื่อมต่อ MySQL ที่ localhost:3307
3. ดูฐานข้อมูล `odpc1`
4. ตรวจสอบตารางต่างๆ:
   - `tb_employee` - ควรมี 4 records
   - `tb_job_title` - ควรมี 3 records
   - `tb_position_level` - ควรมี 5 records
   - `tb_position_type` - ควรมี 3 records
   - `tb_job_group` - ควรมี 4 records

---

## 🔐 ความปลอดภัยตามกฎหมาย PDPA

✅ **ข้อมูลทั้งหมดเป็นข้อมูลสมมุติ 100%**
- ชื่อ-นามสกุล: สมมุติ (เช่น สมชาย ใจดี)
- Email: ตัวอย่าง (employee001@example.com)
- เบอร์โทรศัพท์: สมมุติ (0812345678)
- เลขบัตร: สมมุติ (1234567890001)

✅ **ไม่มีข้อมูลจริงของเจ้าหน้าที่รัฐ**
- ปลอดภัยสำหรับ Demo
- ถูกต้องตามหลักกฎหมาย PDPA
- สามารถโชว์คณะกรรมการได้อย่างมั่นใจ

---

## 🛠️ Troubleshooting

### ❌ Error: MYSQL_PUBLIC_URL is not defined

**สาเหตุ:** ไฟล์ `.env` ไม่ถูกสร้าง หรือตัวแปรไม่ถูกตั้ง

**วิธีแก้:**
```bash
# ตรวจสอบว่าไฟล์ .env มีอยู่
ls -la .env

# ตรวจสอบเนื้อหา
cat .env
```

### ❌ Error: connect ECONNREFUSED 127.0.0.1:3307

**สาเหตุ:** MySQL Server ไม่ทำงาน หรือพอร์ต 3307 ไม่ถูกต้อง

**วิธีแก้:**
1. เปิด XAMPP Control Panel
2. ตรวจสอบว่า MySQL ทำงานที่พอร์ต 3307
3. ตรวจสอบใน Navicat ว่าสามารถเชื่อมต่อได้

### ❌ Error: ER_ACCESS_DENIED_ERROR

**สาเหตุ:** Username หรือ Password ไม่ถูกต้อง

**วิธีแก้:**
```env
# ตรวจสอบใน .env
MYSQL_PUBLIC_URL=mysql://root:@localhost:3307/odpc1
# root = username
# (ว่าง) = password
# localhost = host
# 3307 = port
# odpc1 = database name
```

### ❌ Error: ER_BAD_DB_ERROR

**สาเหตุ:** ฐานข้อมูล `odpc1` ยังไม่ถูกสร้าง

**วิธีแก้:**
1. เปิด Navicat
2. สร้างฐานข้อมูลใหม่ชื่อ `odpc1`
3. ตั้งค่า Character Set เป็น `utf8mb4`
4. ตั้งค่า Collation เป็น `utf8mb4_unicode_ci`

---

## 📝 ไฟล์ที่ถูกสร้าง/แก้ไข

✅ **ไฟล์ใหม่:**
- `.env` - ตัวแปรสภาพแวดล้อมสำหรับ Localhost
- `scripts/seedMockData.js` - สคริปต์สร้างข้อมูลสมมุติ
- `LOCALHOST_SETUP.md` - เอกสารนี้

✅ **ไฟล์ที่แก้ไข:**
- `package.json` - เพิ่ม script `seed:mock`
- `index.js` - มี `sequelize.sync()` แล้ว (ไม่ต้องแก้ไข)
- `config/database.js` - ใช้ `MYSQL_PUBLIC_URL` แล้ว (ไม่ต้องแก้ไข)

---

## 🎯 สรุปการทำงาน

| ข้อ | ภารกิจ | สถานะ |
|-----|--------|-------|
| 1 | สร้างไฟล์ `.env` สำหรับ Localhost | ✅ เสร็จ |
| 2 | ตั้งค่า `MYSQL_PUBLIC_URL` ให้ชี้ไปที่ MySQL Local | ✅ เสร็จ |
| 3 | เปิดสิทธิ์ Auto Migration (`sequelize.sync()`) | ✅ เสร็จ |
| 4 | สร้างสคริปต์ Mock Data (Anonymization) | ✅ เสร็จ |
| 5 | ตรวจสอบ CORS ให้อนุญาต Next.js | ✅ เสร็จ |
| 6 | เพิ่ม script `seed:mock` ใน package.json | ✅ เสร็จ |

---

## 📞 ติดต่อ

หากมีปัญหาหรือคำถาม โปรดตรวจสอบ:
- `DEBUG_MEETING_ERROR.md` - ปัญหา Meeting API
- `FIX_MEETING_500_ERROR.md` - วิธีแก้ Meeting Error
- `FIX_CORS_ERROR.md` - วิธีแก้ CORS Error
- `DEPLOY_INSTRUCTIONS.md` - คำแนะนำการ Deploy

---

**ขอให้โปรเจกต์ประสบความสำเร็จ! 🚀**
