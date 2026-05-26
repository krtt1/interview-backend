# 📊 Mock Data Guide - ข้อมูลสมมุติปลอดภัย PDPA

## 🎯 วัตถุประสงค์

สคริปต์ Mock Data ถูกสร้างขึ้นเพื่อ:
1. ✅ ป้องกันการรั่วไหลข้อมูลส่วนบุคคล (PII - Personally Identifiable Information)
2. ✅ ปฏิบัติตามกฎหมาย PDPA (Personal Data Protection Act)
3. ✅ ให้ข้อมูลปลอดภัยสำหรับ Demo และการทดสอบ
4. ✅ สร้างสภาพแวดล้อมการพัฒนาที่ปลอดภัย

---

## 📋 ข้อมูลสมมุติที่รวมอยู่

### 1. พนักงาน (Employees)

```javascript
// พนักงาน 1 - ผู้ใช้ทั่วไป
{
  id: '1234567890001',
  email: 'employee001@example.com',
  prefix_th: 'นาย',
  first_name_th: 'สมชาย',
  last_name_th: 'ใจดี',
  gender: 'ชาย',
  phone_number: '0812345678',
  role: 'user',
  work_status: 'ปฏิบัติหน้าที่'
}

// พนักงาน 2 - ผู้ดูแลระบบ
{
  id: '1234567890002',
  email: 'employee002@example.com',
  prefix_th: 'นาง',
  first_name_th: 'สมหญิง',
  last_name_th: 'สุขสวัสดิ์',
  gender: 'หญิง',
  phone_number: '0898765432',
  role: 'admin',
  work_status: 'ปฏิบัติหน้าที่'
}

// พนักงาน 3 - ผู้ใช้ทั่วไป
{
  id: '1234567890003',
  email: 'employee003@example.com',
  prefix_th: 'นาย',
  first_name_th: 'สมศักดิ์',
  last_name_th: 'เรียนรู้',
  gender: 'ชาย',
  phone_number: '0856789012',
  role: 'user',
  work_status: 'ปฏิบัติหน้าที่'
}

// พนักงาน 4 - ผู้บริหารระบบ
{
  id: '1234567890004',
  email: 'admin@example.com',
  prefix_th: 'นาย',
  first_name_th: 'สมบูรณ์',
  last_name_th: 'ผู้บริหาร',
  gender: 'ชาย',
  phone_number: '0834567890',
  role: 'superadmin',
  work_status: 'ปฏิบัติหน้าที่'
}
```

### 2. ประเภทบุคลากร (Job Titles)

```javascript
[
  { name: 'ข้าราชการ' },
  { name: 'พนักงานสัญญาจ้าง' },
  { name: 'ลูกจ้างชั่วคราว' }
]
```

### 3. ระดับตำแหน่ง (Position Levels)

```javascript
[
  { name: 'ระดับ 1' },
  { name: 'ระดับ 2' },
  { name: 'ระดับ 3' },
  { name: 'ระดับ 4' },
  { name: 'ระดับ 5' }
]
```

### 4. ตำแหน่งในสายงาน (Position Types)

```javascript
[
  { name: 'ตำแหน่งบริหาร' },
  { name: 'ตำแหน่งวิชาการ' },
  { name: 'ตำแหน่งสนับสนุน' }
]
```

### 5. กลุ่มงาน (Job Groups)

```javascript
[
  { name: 'กลุ่มบริหารทั่วไป' },
  { name: 'กลุ่มวิชาการ' },
  { name: 'กลุ่มเทคนิค' },
  { name: 'กลุ่มสนับสนุน' }
]
```

---

## 🔐 ความปลอดภัยข้อมูล

### ✅ ข้อมูลที่ถูก Anonymize

| ข้อมูล | ตัวอย่าง | หมายเหตุ |
|--------|---------|---------|
| ชื่อ-นามสกุล | สมชาย ใจดี | ชื่อสมมุติ ไม่ใช่ชื่อจริง |
| Email | employee001@example.com | ไม่ใช่ email จริง |
| เบอร์โทรศัพท์ | 0812345678 | หมายเลขสมมุติ |
| เลขบัตร | 1234567890001 | ไม่ใช่เลขบัตรประชาชนจริง |
| วันเกิด | 1985-05-15 | วันที่สมมุติ |

### ✅ ข้อมูลที่ปลอดภัย

- ✅ ไม่มีข้อมูลจริงของเจ้าหน้าที่รัฐ
- ✅ ไม่มีข้อมูลส่วนบุคคลที่ระบุตัวตน
- ✅ ไม่มีข้อมูลที่ละเมิดกฎหมาย PDPA
- ✅ ปลอดภัยสำหรับการ Demo และการทดสอบ

---

## 🚀 วิธีการใช้งาน

### ขั้นตอนที่ 1: รัน Seed Script

```bash
npm run seed:mock
```

### ขั้นตอนที่ 2: ตรวจสอบข้อมูลใน Navicat

1. เปิด Navicat
2. เชื่อมต่อ MySQL ที่ localhost:3307
3. ดูฐานข้อมูล `odpc1`
4. ตรวจสอบตารางต่างๆ

### ขั้นตอนที่ 3: ทดสอบ API

```bash
# ดึงข้อมูลพนักงานทั้งหมด
curl http://localhost:3011/api/employees

# ดึงข้อมูลพนักงานคนเดียว
curl http://localhost:3011/api/employees/1234567890001

# ดึงข้อมูล Job Titles
curl http://localhost:3011/api/job-title

# ดึงข้อมูล Position Levels
curl http://localhost:3011/api/position-level
```

---

## 🔑 ข้อมูลเข้าสู่ระบบตัวอย่าง

### ผู้ใช้ทั่วไป (User)

```
ID: 1234567890001
Password: password123
Email: employee001@example.com
Role: user
```

### ผู้ดูแลระบบ (Admin)

```
ID: 1234567890002
Password: password123
Email: employee002@example.com
Role: admin
```

### ผู้บริหารระบบ (Superadmin)

```
ID: 1234567890004
Password: password123
Email: admin@example.com
Role: superadmin
```

---

## 📝 การแก้ไขข้อมูลสมมุติ

หากต้องการแก้ไขข้อมูลสมมุติ ให้แก้ไขไฟล์:

```
scripts/seedMockData.js
```

### ตัวอย่าง: เพิ่มพนักงานใหม่

```javascript
const mockEmployees = [
  // ... พนักงานเดิม ...
  
  // เพิ่มพนักงานใหม่
  {
    id: '1234567890005',
    password: 'password123',
    email: 'employee005@example.com',
    prefix_th: 'นาย',
    first_name_th: 'สมใจ',
    last_name_th: 'ตั้งใจ',
    gender: 'ชาย',
    birt_date: '1992-07-20',
    age: 32,
    phone_number: '0867890123',
    job_title_id: 1,
    position_level_id: 2,
    position_type_id: 2,
    job_group_id: 2,
    education_level: 'ปริญญาตรี',
    degree_name: 'วิทยาศาสตร์บัณฑิต',
    institution_name: 'มหาวิทยาลัยสมมุติ',
    graduation_year: 2014,
    degree_for_employment: 'วิทยาศาสตร์บัณฑิต',
    highest_degree: 'วิทยาศาสตร์มหาบัณฑิต',
    professional_license_degree: null,
    role: 'user',
    work_status: 'ปฏิบัติหน้าที่'
  }
];
```

จากนั้นรัน:
```bash
npm run seed:mock
```

---

## ⚠️ ข้อควรระวัง

### ❌ อย่าทำ

- ❌ อย่าใช้ข้อมูลจริงของเจ้าหน้าที่รัฐ
- ❌ อย่าเปลี่ยนข้อมูลสมมุติเป็นข้อมูลจริง
- ❌ อย่าแชร์ข้อมูลจริงในโปรเจกต์นี้
- ❌ อย่าใช้ Mock Data ในสภาพแวดล้อม Production

### ✅ ทำ

- ✅ ใช้ Mock Data สำหรับ Development และ Testing
- ✅ ใช้ Mock Data สำหรับ Demo ให้คณะกรรมการ
- ✅ ตรวจสอบว่าข้อมูลเป็นข้อมูลสมมุติเสมอ
- ✅ ปฏิบัติตามกฎหมาย PDPA เสมอ

---

## 🔄 Reset ข้อมูล

หากต้องการลบข้อมูลทั้งหมดและสร้างใหม่:

### วิธีที่ 1: ลบตารางและสร้างใหม่

```bash
# ลบฐานข้อมูล
DROP DATABASE odpc1;

# สร้างฐานข้อมูลใหม่
CREATE DATABASE odpc1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# รัน seed script
npm run seed:mock
```

### วิธีที่ 2: ใช้ Navicat

1. เปิด Navicat
2. คลิกขวาที่ฐานข้อมูล `odpc1`
3. เลือก "Drop Database"
4. สร้างฐานข้อมูลใหม่
5. รัน `npm run seed:mock`

---

## 📊 ตรวจสอบข้อมูล

### ใน Navicat

```sql
-- ตรวจสอบจำนวนพนักงาน
SELECT COUNT(*) FROM tb_employee;
-- ผลลัพธ์: 4

-- ตรวจสอบข้อมูลพนักงาน
SELECT id, first_name_th, last_name_th, email, role FROM tb_employee;

-- ตรวจสอบ Job Titles
SELECT * FROM tb_job_title;

-- ตรวจสอบ Position Levels
SELECT * FROM tb_position_level;
```

### ใน API

```bash
# ดึงข้อมูลพนักงานทั้งหมด
curl http://localhost:3011/api/employees | jq

# ดึงข้อมูลพนักงานคนเดียว
curl http://localhost:3011/api/employees/1234567890001 | jq

# ดึงข้อมูล Job Titles
curl http://localhost:3011/api/job-title | jq
```

---

## 🎓 ตัวอย่างการใช้งาน

### ตัวอย่าง 1: ดึงข้อมูลพนักงาน

```javascript
// Frontend (Next.js)
const response = await fetch('http://localhost:3011/api/employees');
const employees = await response.json();

console.log(employees);
// ผลลัพธ์:
// [
//   {
//     id: '1234567890001',
//     first_name_th: 'สมชาย',
//     last_name_th: 'ใจดี',
//     email: 'employee001@example.com',
//     role: 'user'
//   },
//   ...
// ]
```

### ตัวอย่าง 2: ดึงข้อมูลพนักงานคนเดียว

```javascript
const response = await fetch('http://localhost:3011/api/employees/1234567890001');
const employee = await response.json();

console.log(employee);
// ผลลัพธ์:
// {
//   id: '1234567890001',
//   first_name_th: 'สมชาย',
//   last_name_th: 'ใจดี',
//   email: 'employee001@example.com',
//   phone_number: '0812345678',
//   role: 'user',
//   work_status: 'ปฏิบัติหน้าที่'
// }
```

---

## 📞 ติดต่อ

หากมีคำถามเกี่ยวกับ Mock Data หรือ PDPA Compliance โปรดตรวจสอบ:
- `LOCALHOST_SETUP.md` - คำแนะนำการตั้งค่า Localhost
- `scripts/seedMockData.js` - โค้ด Mock Data
- `config/database.js` - การตั้งค่าฐานข้อมูล

---

**ขอให้ใช้ Mock Data อย่างปลอดภัยและถูกต้องตามกฎหมาย! 🔐**
