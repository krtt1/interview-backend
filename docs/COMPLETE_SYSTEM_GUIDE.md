# คู่มือการใช้งานระบบ ODPC1 Backend API

## สารบัญ
1. [การติดตั้งระบบ](#การติดตั้งระบบ)
2. [การตั้งค่าเริ่มต้น](#การตั้งค่าเริ่มต้น)
3. [API Endpoints ทั้งหมด](#api-endpoints-ทั้งหมด)
4. [Authentication](#authentication)
5. [การใช้งาน API แต่ละส่วน](#การใช้งาน-api-แต่ละส่วน)
6. [Error Handling](#error-handling)
7. [Troubleshooting](#troubleshooting)

---

## การติดตั้งระบบ

### ความต้องการของระบบ (System Requirements)

- **Node.js**: เวอร์ชัน 16.x ขึ้นไป
- **MySQL**: เวอร์ชัน 8.x ขึ้นไป
- **npm** หรือ **pnpm**: สำหรับจัดการ packages
- **Git**: สำหรับดึง source code

### ขั้นตอนที่ 1: ดึง Source Code จาก GitHub

```bash
# Clone repository
git clone <YOUR_GITHUB_REPO_URL>

# เข้าไปยัง folder
cd ODPC1
```

### ขั้นตอนที่ 2: ติดตั้ง Dependencies

```bash
# ใช้ npm
npm install

# หรือใช้ pnpm (ถ้ามี)
pnpm install
```

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

สร้างไฟล์ `.env` จาก `.env.example`:

```bash
cp .env.example .env
```

แก้ไขไฟล์ `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=odpc1
DB_DIALECT=mysql
DB_SSL=false

# Server Configuration
PORT=3011
NODE_ENV=development

# JWT Secret Key
JWT_SECRET=your_super_secret_key_here
```

### ขั้นตอนที่ 4: สร้าง Database

```sql
-- เข้า MySQL
mysql -u root -p

-- สร้าง database
CREATE DATABASE odpc1 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ใช้ database
USE odpc1;

-- Import schema (ถ้ามีไฟล์ .sql)
SOURCE path/to/schema.sql;
```

### ขั้นตอนที่ 5: ตรวจสอบ Database Connection

```bash
npm run test:db
```

ควรเห็น:
```
✅ Database connected successfully
✅ Query test: [ { result: 2 } ]
✅ Total employees: XXX
🎉 All tests passed!
```

### ขั้นตอนที่ 6: รัน Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server จะรันที่: `http://localhost:3011`

### ขั้นตอนที่ 7: ทดสอบ API

```bash
# ทดสอบ health check
curl http://localhost:3011/api/health
```

ควรได้:
```json
{
  "status": "ok",
  "database": {
    "status": "connected"
  }
}
```

---

## การตั้งค่าเริ่มต้น

### สร้าง Admin User แรก

```sql
-- เข้า MySQL
USE odpc1;

-- สร้าง admin user (password: admin123)
INSERT INTO tb_employee (
  id, 
  password, 
  first_name_th, 
  last_name_th, 
  role
) VALUES (
  '0000000000000',
  '$2b$10$hashed_password_here',
  'Admin',
  'System',
  'superadmin'
);
```

หรือใช้ API Register:

```bash
curl -X POST http://localhost:3011/api/employees/register \
  -H "Content-Type: application/json" \
  -d '{
    "id": "0000000000000",
    "password": "admin123",
    "first_name_th": "Admin",
    "last_name_th": "System",
    "role": "superadmin"
  }'
```

---

## API Endpoints ทั้งหมด

### Base URL

- **Development**: `http://localhost:3011/api`
- **Production**: `https://hrodpc1.ddc.moph.go.th/api`

### Authentication

ทุก API (ยกเว้น public endpoints) ต้องใส่ Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 1. Employee API

### 1.1 Register (สมัครสมาชิก)

```
POST /api/employees/register
```

**Request Body:**
```json
{
  "id": "1234567890123",
  "password": "password123",
  "email": "user@example.com",
  "prefix_th": "นาย",
  "first_name_th": "สมชาย",
  "last_name_th": "ใจดี",
  "gender": "ชาย",
  "birt_date": "1990-01-01",
  "phone_number": "0812345678",
  "role": "user"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "1234567890123",
    "first_name_th": "สมชาย",
    "last_name_th": "ใจดี",
    "role": "user"
  }
}
```

### 1.2 Login (เข้าสู่ระบบ)

```
POST /api/employees/login
```

**Request Body:**
```json
{
  "id": "1234567890123",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890123",
    "first_name_th": "สมชาย",
    "last_name_th": "ใจดี",
    "role": "user"
  }
}
```

### 1.3 Get All Employees (ดูรายชื่อพนักงานทั้งหมด)

```
GET /api/employees/getall?page=1&limit=10
Authorization: Bearer <token>
Role: admin
```

**Query Parameters:**
- `page` (optional): หมายเลขหน้า (default: 1)
- `limit` (optional): จำนวนรายการต่อหน้า (default: 10)

**Response (200):**
```json
{
  "data": [
    {
      "id": "1234567890123",
      "first_name_th": "สมชาย",
      "last_name_th": "ใจดี",
      "email": "user@example.com",
      "role": "user",
      "jobTitle": {
        "job_title_name": "นักวิชาการสาธารณสุข"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 1.4 Get Employee by ID

```
GET /api/employees/:id
Authorization: Bearer <token>
Role: admin, user
```

**Response (200):**
```json
{
  "id": "1234567890123",
  "first_name_th": "สมชาย",
  "last_name_th": "ใจดี",
  "email": "user@example.com",
  "phone_number": "0812345678",
  "jobTitle": {
    "job_title_name": "นักวิชาการสาธารณสุข"
  },
  "positionLevel": {
    "position_level_name": "ชำนาญการ"
  }
}
```

### 1.5 Update Employee

```
PUT /api/employees/:id
Authorization: Bearer <token>
Role: admin, user, superadmin
Content-Type: multipart/form-data
```

**Form Data:**
- `first_name_th`: ชื่อ (ภาษาไทย)
- `last_name_th`: นามสกุล (ภาษาไทย)
- `email`: อีเมล
- `phone_number`: เบอร์โทรศัพท์
- `profile_image`: ไฟล์รูปภาพ (optional)

**Response (200):**
```json
{
  "message": "Employee updated successfully",
  "employee": {
    "id": "1234567890123",
    "first_name_th": "สมชาย",
    "last_name_th": "ใจดี"
  }
}
```

### 1.6 Delete Employee

```
DELETE /api/employees/:id
Authorization: Bearer <token>
Role: admin, superadmin
```

**Response (200):**
```json
{
  "message": "Employee deleted successfully"
}
```

### 1.7 Change Password

```
POST /api/employees/change-password
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

### 1.8 Search Employees

```
GET /api/employees/search?query=สมชาย&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `query`: คำค้นหา (ชื่อ หรือ นามสกุล)
- `limit`: จำนวนผลลัพธ์ (default: 10)

### 1.9 Filter by Work Status

```
GET /api/employees/filter/work-status?status=ปฏิบัติงาน
Authorization: Bearer <token>
Role: admin, superadmin
```

### 1.10 Filter by Job Group

```
GET /api/employees/filter/job-group?job_group_id=1
Authorization: Bearer <token>
```

### 1.11 Import Excel

```
POST /api/employees/import-excel
Authorization: Bearer <token>
Role: admin, superadmin
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: ไฟล์ Excel (.xlsx)

---

## 2. Command API (คำสั่ง)

### 2.1 Create Command

```
POST /api/command/create
Authorization: Bearer <token>
Role: admin, superadmin
```

**Request Body:**
```json
{
  "command_title": "คำสั่งที่ 1/2567",
  "command_detail": "รายละเอียดคำสั่ง",
  "date": "2024-01-15",
  "note": "หมายเหตุ",
  "employees": [
    {
      "employee_id": "1234567890123",
      "command_job": "หน้าที่ที่ได้รับมอบหมาย"
    }
  ]
}
```

**Response (201):**
```json
{
  "command_id": 1,
  "command_title": "คำสั่งที่ 1/2567",
  "date": "2024-01-15",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

### 2.2 Get All Commands

```
GET /api/command/getall?page=1&limit=10
Authorization: Bearer <token>
```

### 2.3 Get Command by ID

```
GET /api/command/:id
Authorization: Bearer <token>
```

### 2.4 Update Command

```
PUT /api/command/:id
Authorization: Bearer <token>
Role: admin, superadmin
```

### 2.5 Delete Command

```
DELETE /api/command/:id
Authorization: Bearer <token>
Role: admin, superadmin
```

### 2.6 Upload Command File

```
POST /api/command/:command_id/upload/:employee_id
Authorization: Bearer <token>
Role: admin, superadmin
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: ไฟล์เอกสาร

### 2.7 Download Command File

```
GET /api/command/:command_id/download/:employee_id
Authorization: Bearer <token>
```

### 2.8 Update Employee Job

```
PUT /api/command/:command_id/employee/:employee_id
Authorization: Bearer <token>
Role: admin, superadmin
```

**Request Body:**
```json
{
  "command_job": "หน้าที่ใหม่"
}
```

### 2.9 Export Commands to Excel

```
GET /api/command/export-excel
Authorization: Bearer <token>
Role: admin, superadmin
```

### 2.10 Export Command Employees to Excel

```
GET /api/command/export-command-employees
Authorization: Bearer <token>
Role: admin, superadmin
```

---

## 3. Meeting API (การประชุม/อบรม)

### 3.1 Create Meeting

```
POST /api/meeting/create
Authorization: Bearer <token>
Role: admin
```

**Request Body:**
```json
{
  "meeting_title": "การอบรมเรื่อง...",
  "topic": "หัวข้อการอบรม",
  "start_date": "2024-01-15",
  "end_date": "2024-01-16",
  "organizer": "ผู้จัดการอบรม",
  "location": "ห้องประชุม A",
  "meeting_type": "Onsite",
  "budget_source": "งบประมาณ",
  "note": "หมายเหตุ",
  "participants": [
    "1234567890123",
    "9876543210987"
  ],
  "submit_date": "2024-01-20"
}
```

**Field Descriptions:**
- `meeting_title`: ชื่อการประชุม/อบรม (required)
- `topic`: หัวข้อ (required)
- `start_date`: วันที่เริ่ม (required, format: YYYY-MM-DD)
- `end_date`: วันที่สิ้นสุด (required, format: YYYY-MM-DD)
- `organizer`: ผู้จัด (required)
- `location`: สถานที่ (optional)
- `meeting_type`: รูปแบบ - "Onsite" หรือ "Online" (required)
- `budget_source`: แหล่งงบประมาณ (optional)
- `note`: หมายเหตุ (optional)
- `participants`: รายชื่อผู้เข้าร่วม (array of employee IDs)
- `submit_date`: วันที่กำหนดส่งรายงาน (optional)

**Response (201):**
```json
{
  "meeting_id": 1,
  "meeting_title": "การอบรมเรื่อง...",
  "start_date": "2024-01-15",
  "end_date": "2024-01-16"
}
```

### 3.2 Get All Meetings

```
GET /api/meeting/getall?page=1&limit=10
Authorization: Bearer <token>
```

### 3.3 Get Meeting by ID

```
GET /api/meeting/:id
Authorization: Bearer <token>
```

### 3.4 Update Meeting

```
PUT /api/meeting/:id
Authorization: Bearer <token>
Role: admin
```

### 3.5 Delete Meeting

```
DELETE /api/meeting/:id
Authorization: Bearer <token>
Role: admin
```

### 3.6 Add Participants

```
POST /api/meeting/:id/participants
Authorization: Bearer <token>
Role: admin, superadmin
```

**Request Body:**
```json
{
  "employee_ids": ["1234567890123", "9876543210987"],
  "submit_date": "2024-01-20"
}
```

### 3.7 Submit Attachment

```
POST /api/meeting/:id/submit/:employee_id
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file`: ไฟล์รายงาน

### 3.8 Download Attachment

```
GET /api/meeting/:id/download/:employee_id
Authorization: Bearer <token>
```

### 3.9 Get Participants Status

```
GET /api/meeting/:id/participants
Authorization: Bearer <token>
Role: admin
```

**Response (200):**
```json
{
  "meeting": {
    "meeting_id": 1,
    "meeting_title": "การอบรม..."
  },
  "summary": {
    "total": 10,
    "submitted": 5,
    "pending": 3,
    "late": 2
  }
}
```

### 3.10 Export Meetings to Excel

```
GET /api/meeting/export-excel
Authorization: Bearer <token>
Role: admin, superadmin
```

### 3.11 Export Meeting Employees to Excel

```
GET /api/meeting/export-meeting-employees
Authorization: Bearer <token>
Role: admin, superadmin
```

---

## 4. Capacity API (ข้อมูลศักยภาพ)

### 4.1 Create/Update Capacity

```
POST /api/capacity/upsert
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "employee_id": "1234567890123",
  "training_courses": [
    {
      "course_name": "หลักสูตรการอบรม",
      "institution": "สถาบัน",
      "year": 2024,
      "hours": 40
    }
  ],
  "vector_courses": [...],
  "envocc_courses": [...],
  "law_courses": [...],
  "other_experiences": [...]
}
```

### 4.2 Get Capacity by Employee ID

```
GET /api/capacity/:employee_id
Authorization: Bearer <token>
```

### 4.3 Delete Capacity

```
DELETE /api/capacity/:employee_id
Authorization: Bearer <token>
Role: admin, superadmin
```

### 4.4 Import Capacity from Excel

```
POST /api/capacity/import-excel
Authorization: Bearer <token>
Role: admin, superadmin
Content-Type: multipart/form-data
```

### 4.5 Export Capacity to Excel

```
GET /api/capacity/export-excel
Authorization: Bearer <token>
Role: admin, superadmin
```

---

## 5. Job Title API (ตำแหน่ง)

### 5.1 Create Job Title

```
POST /api/job-title/create
Authorization: Bearer <token>
Role: admin
```

**Request Body:**
```json
{
  "job_title_name": "นักวิชาการสาธารณสุข"
}
```

### 5.2 Get All Job Titles

```
GET /api/job-title/getall
Authorization: Bearer <token>
```

หรือ (public):
```
GET /api/job-title/public/getall
```

### 5.3 Get Job Title by ID

```
GET /api/job-title/:id
Authorization: Bearer <token>
```

### 5.4 Update Job Title

```
PUT /api/job-title/:id
Authorization: Bearer <token>
Role: admin
```

### 5.5 Delete Job Title

```
DELETE /api/job-title/:id
Authorization: Bearer <token>
Role: admin
```

---

## 6. Position Level API (ระดับตำแหน่ง)

### 6.1 Create Position Level

```
POST /api/position-level/create
Authorization: Bearer <token>
Role: admin
```

**Request Body:**
```json
{
  "position_level_name": "ชำนาญการ"
}
```

### 6.2 Get All Position Levels

```
GET /api/position-level/getall
Authorization: Bearer <token>
```

หรือ (public):
```
GET /api/position-level/public/getall
```

### 6.3-6.5 Get by ID, Update, Delete

เหมือนกับ Job Title API

---

## 7. Position Type API (ประเภทตำแหน่ง)

### 7.1 Create Position Type

```
POST /api/position-type/create
Authorization: Bearer <token>
Role: admin
```

**Request Body:**
```json
{
  "position_type_name": "วิชาการ"
}
```

### 7.2-7.5 Get All, Get by ID, Update, Delete

เหมือนกับ Job Title API

---

## 8. Job Group API (กลุ่มงาน)

### 8.1 Create Job Group

```
POST /api/jobgroup/create
Authorization: Bearer <token>
Role: admin
```

**Request Body:**
```json
{
  "job_group_name": "กลุ่มงานควบคุมโรค"
}
```

### 8.2-8.5 Get All, Get by ID, Update, Delete

เหมือนกับ Job Title API

---

## 9. Employee Job History API (ประวัติการทำงาน)

### 9.1 Create Job History

```
POST /api/employees/:id/job-history
Authorization: Bearer <token>
Role: admin, superadmin
```

**Request Body:**
```json
{
  "start_date": "2020-01-01",
  "end_date": "2023-12-31",
  "job_group_id": 1,
  "position_type_id": 1,
  "position_level_id": 1,
  "note": "หมายเหตุ"
}
```

### 9.2 Get Job History

```
GET /api/employees/:id/job-history
Authorization: Bearer <token>
```

### 9.3 Update Job History

```
PUT /api/employees/:employee_id/job-history/:history_id
Authorization: Bearer <token>
Role: admin, superadmin
```

### 9.4 Delete Job History

```
DELETE /api/employees/:employee_id/job-history/:history_id
Authorization: Bearer <token>
Role: admin, superadmin
```

---

## Error Handling

### Error Response Format

```json
{
  "error": "Error message in Thai",
  "details": "Technical details (development only)"
}
```

### Common HTTP Status Codes

- **200 OK**: สำเร็จ
- **201 Created**: สร้างข้อมูลสำเร็จ
- **400 Bad Request**: ข้อมูลไม่ถูกต้อง
- **401 Unauthorized**: ไม่ได้ login หรือ token หมดอายุ
- **403 Forbidden**: ไม่มีสิทธิ์เข้าถึง
- **404 Not Found**: ไม่พบข้อมูล
- **500 Internal Server Error**: เกิดข้อผิดพลาดในระบบ

---

## Troubleshooting

### ปัญหา: Cannot connect to database

**วิธีแก้:**
1. ตรวจสอบ `.env` ว่าตั้งค่าถูกต้อง
2. ตรวจสอบว่า MySQL server กำลังรันอยู่
3. รัน `npm run test:db` เพื่อทดสอบ connection

### ปัญหา: 401 Unauthorized

**วิธีแก้:**
1. ตรวจสอบว่าใส่ Authorization header ถูกต้อง
2. Login ใหม่เพื่อรับ token ใหม่
3. ตรวจสอบว่า token ยังไม่หมดอายุ

### ปัญหา: 500 Internal Server Error

**วิธีแก้:**
1. ดู server logs: `pm2 logs` หรือ console output
2. ตรวจสอบ database connection
3. ตรวจสอบว่าข้อมูลที่ส่งไปถูกต้อง

### ปัญหา: File upload ไม่ได้

**วิธีแก้:**
1. ตรวจสอบว่า folder `uploads/` มีสิทธิ์ write
2. ตรวจสอบขนาดไฟล์ไม่เกิน limit
3. ตรวจสอบ Content-Type เป็น `multipart/form-data`

---

