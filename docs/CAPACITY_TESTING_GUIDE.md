# 🧪 Capacity API - คู่มือการทดสอบ

## 📋 ขั้นตอนการทดสอบ

### 1. เตรียมข้อมูล

#### ก. ต้องมี Employee ในระบบก่อน
```sql
-- ตรวจสอบว่ามี employee อยู่ในระบบ
SELECT id, first_name_th, last_name_th FROM tb_employee LIMIT 5;
```

#### ข. ต้องมี Token สำหรับ Authentication
```
POST http://localhost:3000/api/employees/login
Body:
{
  "email": "admin@example.com",
  "password": "your_password"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. ทดสอบ API ใน Postman

#### Test 1: สร้างข้อมูลสมรรถนะ (POST)

**Request:**
```
POST http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json

Body (raw JSON):
{
  "prefix_name": "นาย",
  "full_name": "ทดสอบ ระบบ",
  "department": "กลุ่มงานทดสอบ",
  "age": 30,
  "education_level": "ปริญญาตรี",
  "work_duration_years": "3 ปี",
  
  "skill_official_writing": "ดี",
  "skill_epidemiology_basic": "ดีมาก",
  "skill_excel": "ดีมาก",
  
  "trainingCourses": [
    "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
    "หลักสูตร FETP"
  ],
  
  "vectorCourses": [
    "ด้านกีฏวิทยา"
  ]
}
```

**Expected Response (200):**
```json
{
  "message": "บันทึกข้อมูลสมรรถนะสำเร็จ",
  "data": {
    "capacity_id": 1,
    "employee_id": "1234567890123",
    "prefix_name": "นาย",
    "full_name": "ทดสอบ ระบบ",
    "trainingCourses": [
      {
        "id": 1,
        "course_name": "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ"
      },
      {
        "id": 2,
        "course_name": "หลักสูตร FETP"
      }
    ],
    "vectorCourses": [
      {
        "id": 1,
        "course_name": "ด้านกีฏวิทยา"
      }
    ]
  }
}
```

---

#### Test 2: ดึงข้อมูลสมรรถนะ (GET)

**Request:**
```
GET http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <your_token>
```

**Expected Response (200):**
```json
{
  "message": "ดึงข้อมูลสมรรถนะสำเร็จ",
  "data": {
    "capacity_id": 1,
    "employee_id": "1234567890123",
    "prefix_name": "นาย",
    "full_name": "ทดสอบ ระบบ",
    "department": "กลุ่มงานทดสอบ",
    "employee": {
      "id": "1234567890123",
      "prefix_th": "นาย",
      "first_name_th": "ทดสอบ",
      "last_name_th": "ระบบ",
      "email": "test@example.com"
    },
    "trainingCourses": [...],
    "vectorCourses": [...],
    "envoccCourses": [],
    "lawCourses": [],
    "otherExperiences": []
  }
}
```

**Expected Response (404) - ไม่พบข้อมูล:**
```json
{
  "message": "ไม่พบข้อมูลสมรรถนะ"
}
```

---

#### Test 3: อัปเดตข้อมูล (POST)

**Request:**
```
POST http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json

Body (raw JSON):
{
  "skill_epidemiology_basic": "เชี่ยวชาญ",
  "trainingCourses": [
    "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
    "หลักสูตร FETP",
    "หลักสูตร CDCU ระบาดวิทยา"
  ]
}
```

**Expected Response (200):**
```json
{
  "message": "บันทึกข้อมูลสมรรถนะสำเร็จ",
  "data": {
    "capacity_id": 1,
    "employee_id": "1234567890123",
    "skill_epidemiology_basic": "เชี่ยวชาญ",
    "trainingCourses": [
      {
        "id": 3,
        "course_name": "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ"
      },
      {
        "id": 4,
        "course_name": "หลักสูตร FETP"
      },
      {
        "id": 5,
        "course_name": "หลักสูตร CDCU ระบาดวิทยา"
      }
    ]
  }
}
```

---

#### Test 4: ดึงข้อมูลทั้งหมด (GET)

**Request:**
```
GET http://localhost:3000/api/capacity
Headers:
  Authorization: Bearer <your_token>
```

**Expected Response (200):**
```json
{
  "message": "ดึงข้อมูลสมรรถนะทั้งหมดสำเร็จ",
  "total": 5,
  "data": [
    {
      "capacity_id": 1,
      "employee_id": "1234567890123",
      "full_name": "ทดสอบ ระบบ",
      "employee": {...},
      "trainingCourses": [...],
      "vectorCourses": [...],
      "envoccCourses": [],
      "lawCourses": [],
      "otherExperiences": []
    }
  ]
}
```

---

#### Test 5: ลบข้อมูล (DELETE)

**Request:**
```
DELETE http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <your_token>
```

**Expected Response (200):**
```json
{
  "message": "ลบข้อมูลสมรรถนะสำเร็จ"
}
```

**Expected Response (400) - ไม่พบข้อมูล:**
```json
{
  "message": "ไม่พบข้อมูลสมรรถนะ"
}
```

---

### 3. ทดสอบ Authorization

#### Test 6: ทดสอบสิทธิ์ User (ควรไม่สามารถสร้าง/แก้ไข/ลบได้)

**Request:**
```
POST http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <user_token>
  Content-Type: application/json

Body:
{
  "full_name": "Test"
}
```

**Expected Response (403):**
```json
{
  "message": "ไม่มีสิทธิ์เข้าถึง"
}
```

#### Test 7: ทดสอบไม่มี Token

**Request:**
```
GET http://localhost:3000/api/capacity/1234567890123
```

**Expected Response (401):**
```json
{
  "message": "ไม่มี token"
}
```

---

### 4. ทดสอบ Edge Cases

#### Test 8: ส่งข้อมูล Employee ที่ไม่มีในระบบ

**Request:**
```
POST http://localhost:3000/api/capacity/9999999999999
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body:
{
  "full_name": "Test"
}
```

**Expected Response (400):**
```json
{
  "message": "ไม่พบข้อมูล employee"
}
```

#### Test 9: ส่ง Array ว่าง

**Request:**
```
POST http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body:
{
  "full_name": "Test",
  "trainingCourses": []
}
```

**Expected Response (200):**
```json
{
  "message": "บันทึกข้อมูลสมรรถนะสำเร็จ",
  "data": {
    "trainingCourses": []
  }
}
```

#### Test 10: ส่งข้อมูลที่ไม่ใช่ Array

**Request:**
```
POST http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <admin_token>
  Content-Type: application/json

Body:
{
  "full_name": "Test",
  "trainingCourses": "หลักสูตร A"
}
```

**Expected Response (400):**
```json
{
  "message": "trainingCourses ต้องเป็น array"
}
```

---

## ✅ Checklist การทดสอบ

### Basic CRUD
- [ ] สร้างข้อมูลสมรรถนะใหม่ (POST)
- [ ] ดึงข้อมูลสมรรถนะตาม employee_id (GET)
- [ ] ดึงข้อมูลสมรรถนะทั้งหมด (GET)
- [ ] อัปเดตข้อมูลสมรรถนะ (POST)
- [ ] ลบข้อมูลสมรรถนะ (DELETE)

### Array Fields
- [ ] เพิ่มหลักสูตรหลายรายการ (trainingCourses)
- [ ] เพิ่มหลักสูตรโรคติดต่อนำโดยแมลง (vectorCourses)
- [ ] เพิ่มหลักสูตร EnvOcc (envoccCourses)
- [ ] เพิ่มหลักสูตรกฎหมาย (lawCourses)
- [ ] เพิ่มประสบการณ์อื่นๆ (otherExperiences)
- [ ] อัปเดต Array (ลบเก่า สร้างใหม่)
- [ ] ส่ง Array ว่าง

### Authorization
- [ ] Admin สามารถสร้าง/แก้ไข/ลบได้
- [ ] Superadmin สามารถสร้าง/แก้ไข/ลบได้
- [ ] User ไม่สามารถสร้าง/แก้ไข/ลบได้
- [ ] ทุก role สามารถดูข้อมูลได้
- [ ] ไม่มี token ไม่สามารถเข้าถึงได้

### Edge Cases
- [ ] Employee ที่ไม่มีในระบบ
- [ ] ข้อมูลสมรรถนะที่ไม่มีในระบบ
- [ ] ส่งข้อมูลที่ไม่ถูกต้อง
- [ ] ส่ง Array ว่าง
- [ ] ส่งข้อมูลที่ไม่ใช่ Array

### Database
- [ ] ตรวจสอบว่าข้อมูลถูกบันทึกใน tb_capacity
- [ ] ตรวจสอบว่าข้อมูล Array ถูกบันทึกในตารางแยก
- [ ] ตรวจสอบว่าการอัปเดต Array ลบข้อมูลเก่าและสร้างใหม่
- [ ] ตรวจสอบว่าการลบ capacity ลบข้อมูลในตารางแยกด้วย

---

## 🔍 การตรวจสอบในฐานข้อมูล

### ตรวจสอบข้อมูลหลัก
```sql
SELECT * FROM tb_capacity WHERE employee_id = '1234567890123';
```

### ตรวจสอบหลักสูตรที่ผ่าน
```sql
SELECT * FROM tb_capacity_training_courses WHERE capacity_id = 1;
```

### ตรวจสอบหลักสูตรโรคติดต่อนำโดยแมลง
```sql
SELECT * FROM tb_capacity_vector_courses WHERE capacity_id = 1;
```

### ตรวจสอบหลักสูตร EnvOcc
```sql
SELECT * FROM tb_capacity_envocc_courses WHERE capacity_id = 1;
```

### ตรวจสอบหลักสูตรกฎหมาย
```sql
SELECT * FROM tb_capacity_law_courses WHERE capacity_id = 1;
```

### ตรวจสอบประสบการณ์อื่นๆ
```sql
SELECT * FROM tb_capacity_other_experiences WHERE capacity_id = 1;
```

---

## 📊 ผลการทดสอบที่คาดหวัง

### สถานะ HTTP
- **200 OK** - สำเร็จ
- **400 Bad Request** - ข้อมูลไม่ถูกต้อง
- **401 Unauthorized** - ไม่มี token
- **403 Forbidden** - ไม่มีสิทธิ์
- **404 Not Found** - ไม่พบข้อมูล
- **500 Internal Server Error** - เกิดข้อผิดพลาดในระบบ

### Transaction
- การสร้าง/อัปเดต/ลบต้องใช้ transaction
- ถ้า step ใดผิดพลาด ต้อง rollback ทั้งหมด
- ข้อมูลต้องสมบูรณ์ (ไม่มีข้อมูลค้างหรือซ้ำซ้อน)

---

## 🎯 สรุป

✅ ทดสอบ CRUD ครบถ้วน  
✅ ทดสอบ Array Fields ทั้งหมด  
✅ ทดสอบ Authorization ตาม Role  
✅ ทดสอบ Edge Cases  
✅ ตรวจสอบข้อมูลในฐานข้อมูล  
✅ ระบบทำงานถูกต้องตามที่คาดหวัง
