# 📋 Employee Job History API Documentation

## Overview
ระบบประวัติการรับตำแหน่งงาน (Job History) สำหรับเก็บประวัติการเปลี่ยนตำแหน่ง/กลุ่มงานของ employee

---

## 🎯 Flow การทำงาน (Step-by-Step)

### Scenario 1: Employee เก่าที่มี job_group อยู่แล้ว

**Step 1:** Admin สร้าง job history record แรก
```
POST /api/employees/:id/job-history/initialize
Body: { "job_group_id": 1 }
```
- ระบบสร้าง record โดย `start_date = NULL`
- `end_date = NULL` (ตำแหน่งปัจจุบัน)
- รอให้ admin กำหนด start_date ภายหลัง

**Step 2:** Admin กำหนด start_date ย้อนหลัง
```
PATCH /api/job-history/:history_id/start-date
Body: { "start_date": "2020-01-15" }
```
- ระบบอัปเดต start_date
- ตอนนี้สามารถคำนวณระยะเวลาได้แล้ว

**Step 3:** ดูตำแหน่งปัจจุบันพร้อมระยะเวลา
```
GET /api/employees/:id/current-job
```
Response:
```json
{
  "employee_id": "1234567890123",
  "current_job": {
    "id": 1,
    "name": "กลุ่มงานบริหาร"
  },
  "start_date": "2020-01-15",
  "duration": {
    "years": 5,
    "months": 0,
    "days": 18,
    "display": "5 ปี 0 เดือน 18 วัน"
  }
}
```

---

### Scenario 2: เปลี่ยนตำแหน่งงาน

**Step 1:** Admin เปลี่ยนตำแหน่ง
```
POST /api/employees/:id/job-history/change
Body: {
  "new_job_group_id": 2,
  "start_date": "2025-02-01"
}
```

**ระบบทำงานอัตโนมัติ (Transaction):**
1. ปิด record เก่า: `end_date = 2025-01-31` (วันก่อน start_date ใหม่)
2. สร้าง record ใหม่: `start_date = 2025-02-01`, `end_date = NULL`
3. อัปเดต `tb_employee.job_group_id = 2`

**Step 2:** ดูประวัติทั้งหมด
```
GET /api/employees/:id/job-history
```
Response:
```json
{
  "employee_id": "1234567890123",
  "total_records": 2,
  "data": [
    {
      "history_id": 2,
      "job_group_id": 2,
      "job_group": { "id": 2, "name": "กลุ่มงานพัฒนา" },
      "start_date": "2025-02-01",
      "end_date": null,
      "is_current": true,
      "duration": {
        "years": 0,
        "months": 0,
        "days": 1
      }
    },
    {
      "history_id": 1,
      "job_group_id": 1,
      "job_group": { "id": 1, "name": "กลุ่มงานบริหาร" },
      "start_date": "2020-01-15",
      "end_date": "2025-01-31",
      "is_current": false,
      "duration": {
        "years": 5,
        "months": 0,
        "days": 16
      }
    }
  ]
}
```

---

## 📡 API Endpoints

### 1. ดึงประวัติการทำงานทั้งหมด
**GET** `/api/employees/:id/job-history`

**Authorization:** Bearer Token (ทุก role)

**Response:**
```json
{
  "employee_id": "1234567890123",
  "total_records": 2,
  "data": [...]
}
```

---

### 2. ดึงตำแหน่งปัจจุบันพร้อมระยะเวลา
**GET** `/api/employees/:id/current-job`

**Authorization:** Bearer Token (ทุก role)

**Response (มี start_date):**
```json
{
  "employee_id": "1234567890123",
  "current_job": {
    "id": 1,
    "name": "กลุ่มงานบริหาร"
  },
  "start_date": "2020-01-15",
  "duration": {
    "years": 5,
    "months": 0,
    "days": 18,
    "display": "5 ปี 0 เดือน 18 วัน"
  }
}
```

**Response (ยังไม่มี start_date):**
```json
{
  "employee_id": "1234567890123",
  "message": "ไม่มีข้อมูลตำแหน่งปัจจุบัน หรือยังไม่ได้กำหนด start_date",
  "current_job": null,
  "duration": null
}
```

---

### 3. สร้าง Job History Record แรก (Initialize)
**POST** `/api/employees/:id/job-history/initialize`

**Authorization:** Bearer Token (admin, superadmin)

**Body:**
```json
{
  "job_group_id": 1
}
```

**Response:**
```json
{
  "message": "สร้าง job history สำเร็จ (start_date = NULL, รอ admin กำหนด)",
  "data": {
    "history_id": 1,
    "employee_id": "1234567890123",
    "job_group_id": 1,
    "start_date": null,
    "end_date": null
  }
}
```

---

### 4. เปลี่ยนตำแหน่งงาน
**POST** `/api/employees/:id/job-history/change`

**Authorization:** Bearer Token (admin, superadmin)

**Body:**
```json
{
  "new_job_group_id": 2,
  "start_date": "2025-02-01"
}
```

**Validation:**
- `start_date` ต้องไม่เกินวันปัจจุบัน
- ต้องมี active job history อยู่ก่อน
- ไม่สามารถเปลี่ยนเป็น job group เดิมได้

**Response:**
```json
{
  "message": "เปลี่ยนตำแหน่งสำเร็จ",
  "data": {
    "history_id": 2,
    "employee_id": "1234567890123",
    "job_group_id": 2,
    "start_date": "2025-02-01",
    "end_date": null
  }
}
```

---

### 5. อัปเดต Start Date
**PATCH** `/api/job-history/:history_id/start-date`

**Authorization:** Bearer Token (admin, superadmin)

**Body:**
```json
{
  "start_date": "2020-01-15"
}
```

**Validation:**
- `start_date` ต้องไม่เกินวันปัจจุบัน
- สามารถแก้ไขได้เฉพาะ active record (end_date = NULL)

**Response:**
```json
{
  "message": "อัปเดต start_date สำเร็จ",
  "data": {
    "history_id": 1,
    "employee_id": "1234567890123",
    "job_group_id": 1,
    "start_date": "2020-01-15",
    "end_date": null
  }
}
```

---

## 🔒 Business Rules

### 1. Unique Active Job
- 1 employee มี active job history (end_date = NULL) ได้เพียง 1 record
- Database มี unique index: `unique_active_job_per_employee`

### 2. Start Date Validation
- `start_date` ต้องไม่เกินวันปัจจุบัน
- `start_date = NULL` หมายถึง "ยังไม่ทราบวันเริ่ม"
- ถ้า `start_date = NULL` จะไม่คำนวณระยะเวลา

### 3. Transaction Safety
- การเปลี่ยนตำแหน่งใช้ transaction
- ถ้า step ใดผิดพลาด ระบบจะ rollback ทั้งหมด

### 4. Duration Calculation
- คำนวณแบบ real-time (ไม่เก็บใน database)
- ใช้ `start_date` และ `end_date` (หรือวันปัจจุบัน)
- คืนค่าเป็น `{ years, months, days }`

---

## 🗄️ Database Schema

```sql
CREATE TABLE tb_employee_job_history (
  history_id INT PRIMARY KEY AUTO_INCREMENT,
  employee_id VARCHAR(13) NOT NULL,
  job_group_id INT NOT NULL,
  start_date DATE NULL COMMENT 'วันที่เริ่มตำแหน่ง (NULL = ยังไม่ทราบ)',
  end_date DATE NULL COMMENT 'วันที่สิ้นสุดตำแหน่ง (NULL = ปัจจุบัน)',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (employee_id) REFERENCES tb_employee(id),
  FOREIGN KEY (job_group_id) REFERENCES tb_job_group(id),
  
  UNIQUE INDEX unique_active_job_per_employee (employee_id) 
    WHERE end_date IS NULL
);
```

---

## ⚠️ Error Handling

### Common Errors

**400 Bad Request:**
```json
{
  "message": "กรุณาระบุ start_date สำหรับตำแหน่งใหม่"
}
```

**400 Bad Request:**
```json
{
  "message": "start_date ต้องไม่เกินวันปัจจุบัน"
}
```

**400 Bad Request:**
```json
{
  "message": "Employee มี active job history อยู่แล้ว"
}
```

**400 Bad Request:**
```json
{
  "message": "ไม่สามารถเปลี่ยนเป็น job group เดิมได้"
}
```

---

## 📝 ตัวอย่างการใช้งานใน Postman

### 1. Initialize Job History
```
POST http://localhost:3000/api/employees/1234567890123/job-history/initialize
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "job_group_id": 1
}
```

### 2. Update Start Date
```
PATCH http://localhost:3000/api/job-history/1/start-date
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "start_date": "2020-01-15"
}
```

### 3. Change Job Group
```
POST http://localhost:3000/api/employees/1234567890123/job-history/change
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json
Body:
{
  "new_job_group_id": 2,
  "start_date": "2025-02-01"
}
```

### 4. Get Current Job with Duration
```
GET http://localhost:3000/api/employees/1234567890123/current-job
Headers:
  Authorization: Bearer <token>
```

### 5. Get Full Job History
```
GET http://localhost:3000/api/employees/1234567890123/job-history
Headers:
  Authorization: Bearer <token>
```

---

## 🎓 สรุป

✅ ไม่กระทบข้อมูลเดิมใน `tb_employee`  
✅ `start_date = NULL` สำหรับข้อมูล legacy  
✅ Admin กำหนด start_date เองได้ (ย้อนหลังได้)  
✅ ใช้ Transaction เพื่อความปลอดภัย  
✅ คำนวณระยะเวลาแบบ real-time (ไม่เก็บใน DB)  
✅ Unique constraint ป้องกัน active job ซ้ำ  
✅ Validation ครบถ้วน
