# 📊 Capacity API - คู่มือการใช้งาน

## 🎯 ภาพรวม

ระบบจัดการข้อมูลสมรรถนะบุคลากร (Capacity Management System) สำหรับเก็บข้อมูลทักษะ ความสามารถ ประสบการณ์ และคุณสมบัติเฉพาะของบุคลากรในองค์กร

---

## 📋 โครงสร้างฐานข้อมูล

### ตารางหลัก: `tb_capacity`
เก็บข้อมูลสมรรถนะหลักของบุคลากร (ฟิลด์เดี่ยว)

### ตารางเสริม (สำหรับข้อมูลที่เลือกได้มากกว่า 1 ข้อ):
1. **tb_capacity_training_courses** - หลักสูตร/ประสบการณ์ที่ผ่าน
2. **tb_capacity_vector_courses** - หลักสูตรโรคติดต่อนำโดยแมลง
3. **tb_capacity_envocc_courses** - หลักสูตร EnvOcc
4. **tb_capacity_law_courses** - หลักสูตรกฎหมาย
5. **tb_capacity_other_experiences** - ประสบการณ์อื่นๆ

---

## 📡 API Endpoints

### 1. สร้าง/อัปเดตข้อมูลสมรรถนะ
```
POST /api/capacity/:id
```

**Authorization:** Bearer Token (admin, superadmin เท่านั้น)

**Parameters:**
- `:id` - employee_id (รหัสบัตรประชาชน 13 หลัก)

**Request Body Example:**
```json
{
  "prefix_name": "นาย",
  "full_name": "สมชาย ใจดี",
  "department": "กลุ่มงานระบาดวิทยา",
  "age": 35,
  "education_level": "ปริญญาตรี",
  "work_duration_years": "5 ปี",
  
  "skill_official_writing": "ดี",
  "skill_meeting_summary": "ดีมาก",
  "skill_computer_connection": "ดีมาก",
  "skill_communication": "ดี",
  "skill_epidemiology_basic": "ดีมาก",
  "skill_excel": "ดีมาก",
  "skill_presentation": "ดี",
  "skill_ai_tools": "ปานกลาง",
  "skill_english_speaking": "ปานกลาง",
  "skill_english_writing": "ปานกลาง",
  
  "english_test_score": "TOEIC 650 คะแนน",
  
  "has_first_aid_course": "ผ่าน",
  "skill_first_aid": "ดี",
  
  "special_skills_experience": "ถนัดการวิเคราะห์ข้อมูลด้วย R และ Python",
  
  "liaison_experience": "2 ปี",
  
  "competency_analytical_thinking": "ดี",
  "competency_information_seeking": "ดี",
  "competency_strategic_orientation": "ปานกลาง",
  
  "epi_surveillance": "ดีมาก",
  "epi_situation_report": "ดี",
  "epi_data_analysis": "ดีมาก"
}
```


**ตัวอย่างข้อมูลที่เลือกได้มากกว่า 1 ข้อ (Array):**
```json
{
  "prefix_name": "นาย",
  "full_name": "สมชาย ใจดี",
  "department": "กลุ่มงานระบาดวิทยา",
  
  "trainingCourses": [
    "เคยฝึกประสบการณ์ที่ SAT/ มีประสบการณ์อยู่เวร SAT",
    "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
    "หลักสูตรฝึกอบรมผู้เชี่ยวชาญด้านระบาดวิทยาภาคสนาม (FETP)",
    "หลักสูตร CDCU ระบาดวิทยา ด้านการเฝ้าระวัง สอบสวน ควบคุมโรค"
  ],
  
  "vectorCourses": [
    "ด้านกีฏวิทยา",
    "ด้านเครื่องพ่นสารเคมี"
  ],
  
  "envoccCourses": [
    "หลักสูตรหน่วยปฏิบัติการควบคุมโรคจากการประกอบอาชีพและโรคจากสิ่งแวดล้อม (EnvOcc CU) (ภาคทฤษฏี)",
    "หลักสูตรการใช้เครื่องมือตรวจวัดทางสุขศาสตร์อุตสาหกรรม"
  ],
  
  "lawCourses": [
    "หลักสูตร พรบ.โรคติดต่อ 2558",
    "หลักสูตร พรบ.โรคจากการประกอบอาชีพและโรคจากสิ่งแวดล้อม 2562"
  ],
  
  "otherExperiences": [
    "จัดซื้อจัดจ้างแบบ โดยวิธีเฉพาะเจาะจง",
    "มีรายชื่ออยู่ในคำสั่งพนักงานขับรถสำรอง ของ สคร.1"
  ]
}
```

**Response:**
```json
{
  "message": "บันทึกข้อมูลสมรรถนะสำเร็จ",
  "data": {
    "capacity_id": 1,
    "employee_id": "1234567890123",
    "prefix_name": "นาย",
    "full_name": "สมชาย ใจดี",
    "department": "กลุ่มงานระบาดวิทยา",
    "age": 35,
    "employee": {
      "id": "1234567890123",
      "prefix_th": "นาย",
      "first_name_th": "สมชาย",
      "last_name_th": "ใจดี",
      "email": "somchai@example.com"
    },
    "trainingCourses": [
      {
        "id": 1,
        "course_name": "เคยฝึกประสบการณ์ที่ SAT/ มีประสบการณ์อยู่เวร SAT"
      },
      {
        "id": 2,
        "course_name": "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ"
      }
    ],
    "vectorCourses": [],
    "envoccCourses": [],
    "lawCourses": [],
    "otherExperiences": []
  }
}
```

---

### 2. ดึงข้อมูลสมรรถนะตาม employee_id
```
GET /api/capacity/:id
```

**Authorization:** Bearer Token (ทุก role)

**Parameters:**
- `:id` - employee_id (รหัสบัตรประชาชน 13 หลัก)

**Response:**
```json
{
  "message": "ดึงข้อมูลสมรรถนะสำเร็จ",
  "data": {
    "capacity_id": 1,
    "employee_id": "1234567890123",
    "prefix_name": "นาย",
    "full_name": "สมชาย ใจดี",
    "department": "กลุ่มงานระบาดวิทยา",
    "skill_epidemiology_basic": "ดีมาก",
    "epi_data_analysis": "ดีมาก",
    "employee": {
      "id": "1234567890123",
      "prefix_th": "นาย",
      "first_name_th": "สมชาย",
      "last_name_th": "ใจดี",
      "email": "somchai@example.com"
    },
    "trainingCourses": [
      {
        "id": 1,
        "course_name": "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ"
      }
    ],
    "vectorCourses": [],
    "envoccCourses": [],
    "lawCourses": [],
    "otherExperiences": []
  }
}
```

**Error Response (404):**
```json
{
  "message": "ไม่พบข้อมูลสมรรถนะ"
}
```

---

### 3. ดึงข้อมูลสมรรถนะทั้งหมด
```
GET /api/capacity
```

**Authorization:** Bearer Token (ทุก role)

**Response:**
```json
{
  "message": "ดึงข้อมูลสมรรถนะทั้งหมดสำเร็จ",
  "total": 15,
  "data": [
    {
      "capacity_id": 1,
      "employee_id": "1234567890123",
      "full_name": "สมชาย ใจดี",
      "department": "กลุ่มงานระบาดวิทยา",
      "employee": {...},
      "trainingCourses": [...],
      "vectorCourses": [...],
      "envoccCourses": [...],
      "lawCourses": [...],
      "otherExperiences": [...]
    }
  ]
}
```

---

### 4. ลบข้อมูลสมรรถนะ
```
DELETE /api/capacity/:id
```

**Authorization:** Bearer Token (admin, superadmin เท่านั้น)

**Parameters:**
- `:id` - employee_id (รหัสบัตรประชาชน 13 หลัก)

**Response:**
```json
{
  "message": "ลบข้อมูลสมรรถนะสำเร็จ"
}
```

**Error Response (400):**
```json
{
  "message": "ไม่พบข้อมูลสมรรถนะ"
}
```

---

### 5. Export ข้อมูลเป็น Excel
```
GET /api/capacity/export
```

**Authorization:** Bearer Token (admin, superadmin เท่านั้น)

**Response:** ไฟล์ Excel (.xlsx) ที่มีข้อมูลสมรรถนะทั้งหมด

**ชื่อไฟล์:** `capacity_export_YYYY-MM-DD.xlsx`

**คอลัมน์ในไฟล์:**
- รหัสพนักงาน
- คำนำหน้า
- ชื่อ-นามสกุล
- แผนก
- อายุ
- ระดับการศึกษา
- ระยะเวลาปฏิบัติงาน
- ทักษะต่างๆ (การเขียนหนังสือราชการ, การสรุปการประชุม, ฯลฯ)
- หลักสูตรที่ผ่าน (แยกด้วย comma)
- หลักสูตรโรคติดต่อนำโดยแมลง (แยกด้วย comma)
- หลักสูตร EnvOcc (แยกด้วย comma)
- หลักสูตรกฎหมาย (แยกด้วย comma)
- ประสบการณ์อื่นๆ (แยกด้วย comma)

**ตัวอย่างการใช้งาน:**
```javascript
// JavaScript/React
const exportExcel = async () => {
  const response = await fetch('http://localhost:3000/api/capacity/export', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `capacity_export_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
};
```

---

### 6. Import ข้อมูลจาก Excel
```
POST /api/capacity/import
```

**Authorization:** Bearer Token (admin, superadmin เท่านั้น)

**Content-Type:** `multipart/form-data`

**Request Body:**
- `file` - ไฟล์ Excel (.xlsx หรือ .xls)

**รูปแบบไฟล์ Excel:**
- ต้องมี header row ที่ row 1
- ข้อมูลเริ่มจาก row 2
- คอลัมน์ที่เป็น array (หลักสูตร/ประสบการณ์) ให้แยกด้วย comma
- รหัสพนักงานต้องมีอยู่ในระบบ

**Response:**
```json
{
  "message": "Import ข้อมูลเสร็จสิ้น",
  "summary": {
    "success": 50,
    "failed": 2,
    "total": 52
  },
  "errors": [
    "Row 15: ไม่พบพนักงานรหัส 1234567890999",
    "Row 28: ไม่พบพนักงานรหัส 9876543210111"
  ]
}
```

**ตัวอย่างการใช้งาน:**
```javascript
// JavaScript/React
const importExcel = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:3000/api/capacity/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const result = await response.json();
  console.log(`สำเร็จ: ${result.summary.success}, ล้มเหลว: ${result.summary.failed}`);
  
  if (result.errors.length > 0) {
    console.log('Errors:', result.errors);
  }
};
```

**ตัวอย่าง HTML Form:**
```html
<form id="importForm" enctype="multipart/form-data">
  <input type="file" name="file" accept=".xlsx,.xls" required />
  <button type="submit">Import</button>
</form>

<script>
document.getElementById('importForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  const response = await fetch('http://localhost:3000/api/capacity/import', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });
  
  const result = await response.json();
  alert(result.message);
});
</script>
```

**หมายเหตุ:**
- ไฟล์ต้องมีขนาดไม่เกิน 10MB
- รองรับเฉพาะไฟล์ .xlsx และ .xls
- ถ้ารหัสพนักงานมีอยู่แล้ว จะทำการอัปเดตข้อมูล
- ถ้ารหัสพนักงานไม่มีในระบบ จะข้ามและบันทึกใน errors

---

## 📝 ตัวอย่างการใช้งานใน Postman

### 1. สร้างข้อมูลสมรรถนะ
```
POST http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
Body (raw JSON):
{
  "prefix_name": "นาย",
  "full_name": "สมชาย ใจดี",
  "department": "กลุ่มงานระบาดวิทยา",
  "age": 35,
  "education_level": "ปริญญาตรี",
  "work_duration_years": "5 ปี",
  "skill_epidemiology_basic": "ดีมาก",
  "epi_data_analysis": "ดีมาก",
  "trainingCourses": [
    "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
    "หลักสูตร FETP"
  ]
}
```

### 2. ดึงข้อมูลสมรรถนะ
```
GET http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <your_token>
```

### 3. ดึงข้อมูลทั้งหมด
```
GET http://localhost:3000/api/capacity
Headers:
  Authorization: Bearer <your_token>
```

### 4. อัปเดตข้อมูล
```
POST http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <your_token>
  Content-Type: application/json
Body (raw JSON):
{
  "skill_epidemiology_basic": "ดีมาก",
  "epi_data_analysis": "ดีมาก",
  "trainingCourses": [
    "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
    "หลักสูตร FETP",
    "หลักสูตรใหม่"
  ]
}
```

### 5. ลบข้อมูล
```
DELETE http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <your_token>
```

### 6. Export Excel
```
GET http://localhost:3000/api/capacity/export
Headers:
  Authorization: Bearer <your_token>
```

**หมายเหตุ:** ใน Postman ให้คลิก "Send and Download" เพื่อดาวน์โหลดไฟล์ Excel

### 7. Import Excel
```
POST http://localhost:3000/api/capacity/import
Headers:
  Authorization: Bearer <your_token>
Body:
  - เลือก "form-data"
  - Key: file (เปลี่ยนเป็น File type)
  - Value: เลือกไฟล์ Excel
```

---

## 🔒 Business Rules

1. **One-to-One Relationship:** 1 employee มีข้อมูลสมรรถนะได้เพียง 1 record
2. **Multiple Selection:** ฟิลด์ที่เลือกได้มากกว่า 1 ข้อ ใช้ array ส่งข้อมูล
3. **Transaction Safety:** ใช้ transaction ในทุกการเปลี่ยนแปลงข้อมูล
4. **Authorization:** ทุก role ดูได้, เฉพาะ admin/superadmin สร้าง/แก้ไข/ลบได้
5. **Update Behavior:** เมื่ออัปเดต array จะลบข้อมูลเก่าทั้งหมดและสร้างใหม่

---

## 💡 Tips สำหรับ Frontend

### 1. การส่งข้อมูล Array
```javascript
const capacityData = {
  prefix_name: "นาย",
  full_name: "สมชาย ใจดี",
  department: "กลุ่มงานระบาดวิทยา",
  
  // ฟิลด์ที่เลือกได้มากกว่า 1 ข้อ ส่งเป็น array
  trainingCourses: [
    "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
    "หลักสูตร FETP"
  ],
  
  vectorCourses: [
    "ด้านกีฏวิทยา"
  ]
};

// ส่งข้อมูล
fetch('http://localhost:3000/api/capacity/1234567890123', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(capacityData)
});
```

### 2. การแสดงผล Array
```javascript
// แสดงหลักสูตรที่ผ่าน
capacity.trainingCourses.forEach(course => {
  console.log(course.course_name);
});
```

### 3. การอัปเดตข้อมูล
```javascript
// เมื่ออัปเดต array จะลบข้อมูลเก่าทั้งหมดและสร้างใหม่
const updatedData = {
  trainingCourses: [
    "หลักสูตรเก่า 1",
    "หลักสูตรเก่า 2",
    "หลักสูตรใหม่"  // เพิ่มใหม่
  ]
};
```

### 4. Export Excel
```javascript
const exportCapacityExcel = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/capacity/export', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) throw new Error('Export failed');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `capacity_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export error:', error);
  }
};
```

### 5. Import Excel
```javascript
const importCapacityExcel = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('http://localhost:3000/api/capacity/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const result = await response.json();
    
    console.log(`Import สำเร็จ: ${result.summary.success} รายการ`);
    console.log(`Import ล้มเหลว: ${result.summary.failed} รายการ`);
    
    if (result.errors.length > 0) {
      console.log('รายการที่ล้มเหลว:', result.errors);
    }
    
    return result;
  } catch (error) {
    console.error('Import error:', error);
  }
};

// ใช้งานกับ input file
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (file) {
    await importCapacityExcel(file);
  }
});
```

---

## ⚠️ Error Handling

### Common Errors

**400 Bad Request:**
```json
{
  "message": "ไม่พบข้อมูล employee"
}
```

**404 Not Found:**
```json
{
  "message": "ไม่พบข้อมูลสมรรถนะ"
}
```

**401 Unauthorized:**
```json
{
  "message": "ไม่มีสิทธิ์เข้าถึง"
}
```

---

## 🎯 สรุป

✅ ระบบสมรรถนะบุคลากรสร้างเสร็จสมบูรณ์  
✅ รองรับข้อมูลที่เลือกได้มากกว่า 1 ข้อ (Array)  
✅ Transaction Safety และ Authorization  
✅ เอกสารครบถ้วน พร้อมตัวอย่าง  
✅ พร้อมใช้งานทันที


## 📊 สรุป API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/capacity/:id` | สร้าง/อัปเดตข้อมูล | admin, superadmin |
| GET | `/api/capacity/:id` | ดึงข้อมูล 1 คน | ทุก role |
| GET | `/api/capacity` | ดึงข้อมูลทั้งหมด | ทุก role |
| DELETE | `/api/capacity/:id` | ลบข้อมูล | admin, superadmin |
| **GET** | **`/api/capacity/export`** | **Export Excel** | **admin, superadmin** |
| **POST** | **`/api/capacity/import`** | **Import Excel** | **admin, superadmin** |

---

## 🎯 สรุปการพัฒนา

✅ ระบบสมรรถนะบุคลากรสร้างเสร็จสมบูรณ์  
✅ รองรับข้อมูลที่เลือกได้มากกว่า 1 ข้อ (Array)  
✅ Transaction Safety และ Authorization  
✅ **Export/Import Excel พร้อมใช้งาน**  
✅ เอกสารครบถ้วน พร้อมตัวอย่าง  
✅ พร้อมใช้งานทันที
