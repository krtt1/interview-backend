# 📥📤 Capacity Import/Export Excel - คู่มือการใช้งาน

## 🎯 ภาพรวม

ระบบรองรับการ Import และ Export ข้อมูลสมรรถนะบุคลากรผ่านไฟล์ Excel เพื่อความสะดวกในการจัดการข้อมูลจำนวนมาก

---

## 📡 API Endpoints

### 1. Export ข้อมูลเป็น Excel
```
GET /api/capacity/export
```

**Authorization:** Bearer Token (admin, superadmin เท่านั้น)

**Response:** ไฟล์ Excel (.xlsx)

**ชื่อไฟล์:** `capacity_export_YYYY-MM-DD.xlsx`

---

### 2. Import ข้อมูลจาก Excel
```
POST /api/capacity/import
```

**Authorization:** Bearer Token (admin, superadmin เท่านั้น)

**Content-Type:** `multipart/form-data`

**Body:**
- `file` - ไฟล์ Excel (.xlsx)

**Response:**
```json
{
  "message": "Import ข้อมูลเสร็จสิ้น",
  "summary": {
    "success": 45,
    "failed": 5,
    "total": 50
  },
  "errors": [
    "Row 3: ไม่พบพนักงานรหัส 9999999999999",
    "Row 7: ไม่มีรหัสพนักงาน"
  ]
}
```

---

## 📝 รูปแบบไฟล์ Excel

### โครงสร้าง Columns (25 คอลัมน์)

| Column | ชื่อคอลัมน์ | ประเภทข้อมูล | ตัวอย่าง |
|--------|-------------|--------------|----------|
| A | รหัสพนักงาน | Text (13 หลัก) | 1234567890123 |
| B | คำนำหน้า | Text | นาย |
| C | ชื่อ-นามสกุล | Text | สมชาย ใจดี |
| D | แผนก | Text | กลุ่มงานระบาดวิทยา |
| E | อายุ | Number | 35 |
| F | ระดับการศึกษา | Text | ปริญญาตรี |
| G | ระยะเวลาปฏิบัติงาน | Text | 5 ปี |
| H | การเขียนหนังสือราชการ | Text | ดี |
| I | การสรุปการประชุม | Text | ดีมาก |
| J | การใช้คอมพิวเตอร์ | Text | ดีมาก |
| K | การสื่อสาร | Text | ดี |
| L | หลักระบาดวิทยา | Text | ดีมาก |
| M | Excel | Text | ดีมาก |
| N | PowerPoint | Text | ดี |
| O | AI Tools | Text | ปานกลาง |
| P | ภาษาอังกฤษ พูด-ฟัง | Text | ปานกลาง |
| Q | ภาษาอังกฤษ อ่าน-เขียน | Text | ปานกลาง |
| R | คะแนนภาษาอังกฤษ | Text | TOEIC 650 |
| S | ผ่าน First Aid | Text | ผ่าน |
| T | ทักษะ First Aid | Text | ดี |
| U | หลักสูตรที่ผ่าน | Text (คั่นด้วย comma) | หลักสูตร FETP, หลักสูตร CDCU |
| V | หลักสูตรโรคติดต่อนำโดยแมลง | Text (คั่นด้วย comma) | ด้านกีฏวิทยา |
| W | หลักสูตร EnvOcc | Text (คั่นด้วย comma) | หลักสูตร EnvOcc CU |
| X | หลักสูตรกฎหมาย | Text (คั่นด้วย comma) | พรบ.โรคติดต่อ 2558 |
| Y | ประสบการณ์อื่นๆ | Text (คั่นด้วย comma) | จัดซื้อจัดจ้าง |

---

## 🚀 วิธีการใช้งาน

### 1. Export ข้อมูล

#### ใน Postman
```
GET http://localhost:3000/api/capacity/export
Headers:
  Authorization: Bearer <admin_token>

Send and Save Response > Save to a file
```

#### ใน JavaScript
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3000/api/capacity/export', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.blob())
.then(blob => {
  // สร้าง download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `capacity_export_${new Date().toISOString().split('T')[0]}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
})
.catch(error => console.error('Error:', error));
```

#### ใน React
```javascript
const handleExport = async () => {
  try {
    const token = localStorage.getItem('token');
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
    a.remove();
    window.URL.revokeObjectURL(url);

    alert('Export สำเร็จ');
  } catch (error) {
    console.error('Error:', error);
    alert('เกิดข้อผิดพลาด');
  }
};
```

---

### 2. Import ข้อมูล

#### ใน Postman
```
POST http://localhost:3000/api/capacity/import
Headers:
  Authorization: Bearer <admin_token>
Body:
  form-data
  Key: file
  Type: File
  Value: [เลือกไฟล์ Excel]
```

#### ใน JavaScript (Vanilla)
```javascript
const handleImport = async (file) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('http://localhost:3000/api/capacity/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Import สำเร็จ:', result.summary);
      if (result.errors.length > 0) {
        console.log('Errors:', result.errors);
      }
      alert(`Import สำเร็จ ${result.summary.success} รายการ, ล้มเหลว ${result.summary.failed} รายการ`);
    } else {
      alert(`เกิดข้อผิดพลาด: ${result.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('เกิดข้อผิดพลาด');
  }
};

// ใช้งานกับ input file
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    handleImport(file);
  }
});
```

#### ใน React
```javascript
import React, { useState } from 'react';

const CapacityImport = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = async () => {
    if (!file) {
      alert('กรุณาเลือกไฟล์');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/capacity/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      setResult(data);

      if (response.ok) {
        alert(`Import สำเร็จ ${data.summary.success} รายการ, ล้มเหลว ${data.summary.failed} รายการ`);
      } else {
        alert(`เกิดข้อผิดพลาด: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาด');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Import ข้อมูลสมรรถนะ</h2>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleImport} disabled={loading}>
        {loading ? 'กำลัง Import...' : 'Import'}
      </button>

      {result && (
        <div>
          <h3>ผลการ Import</h3>
          <p>สำเร็จ: {result.summary.success}</p>
          <p>ล้มเหลว: {result.summary.failed}</p>
          <p>รวม: {result.summary.total}</p>
          
          {result.errors.length > 0 && (
            <div>
              <h4>Errors:</h4>
              <ul>
                {result.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CapacityImport;
```

---

## 📋 ตัวอย่างไฟล์ Excel

### Row 1 (Header)
```
รหัสพนักงาน | คำนำหน้า | ชื่อ-นามสกุล | แผนก | อายุ | ...
```

### Row 2 (Data)
```
1234567890123 | นาย | สมชาย ใจดี | กลุ่มงานระบาดวิทยา | 35 | ปริญญาตรี | 5 ปี | ดี | ดีมาก | ดีมาก | ดี | ดีมาก | ดีมาก | ดี | ปานกลาง | ปานกลาง | ปานกลาง | TOEIC 650 | ผ่าน | ดี | หลักสูตร FETP, หลักสูตร CDCU | ด้านกีฏวิทยา | หลักสูตร EnvOcc CU | พรบ.โรคติดต่อ 2558 | จัดซื้อจัดจ้าง
```

---

## ⚠️ ข้อควรระวัง

### 1. รหัสพนักงาน
- ต้องมีอยู่ในระบบ (tb_employee) ก่อน
- ต้องเป็นตัวเลข 13 หลัก
- ห้ามเว้นว่าง

### 2. ข้อมูลที่เลือกได้มากกว่า 1 ข้อ (Array Fields)
- คั่นด้วย comma (,)
- ตัวอย่าง: `หลักสูตร A, หลักสูตร B, หลักสูตร C`
- ถ้าไม่มีข้อมูล ให้เว้นว่างไว้

### 3. การ Import
- ระบบจะอัปเดตข้อมูลถ้ามีอยู่แล้ว
- ระบบจะสร้างใหม่ถ้ายังไม่มี
- ใช้ transaction (ถ้า error จะ rollback)

### 4. ขนาดไฟล์
- แนะนำไม่เกิน 1000 rows ต่อครั้ง
- ถ้ามีข้อมูลมาก ควรแบ่งเป็นหลายไฟล์

---

## 🔍 การตรวจสอบผลลัพธ์

### ตรวจสอบในฐานข้อมูล
```sql
-- ตรวจสอบข้อมูลที่ import
SELECT * FROM tb_capacity WHERE employee_id = '1234567890123';

-- ตรวจสอบหลักสูตรที่ผ่าน
SELECT * FROM tb_capacity_training_courses WHERE capacity_id = 1;
```

### ตรวจสอบผ่าน API
```bash
GET http://localhost:3000/api/capacity/1234567890123
Headers:
  Authorization: Bearer <token>
```

---

## 💡 Tips

### 1. เตรียมข้อมูล
- Export ข้อมูลเดิมออกมาก่อน เพื่อดูรูปแบบ
- ใช้ไฟล์ที่ Export เป็น Template
- แก้ไขข้อมูลใน Excel แล้ว Import กลับเข้าไป

### 2. ทดสอบก่อน
- ทดสอบด้วยข้อมูลน้อยๆ ก่อน (5-10 rows)
- ตรวจสอบผลลัพธ์ว่าถูกต้อง
- แล้วค่อย Import ข้อมูลจริงทั้งหมด

### 3. Backup
- Backup ฐานข้อมูลก่อน Import ข้อมูลจำนวนมาก
- เก็บไฟล์ Excel ต้นฉบับไว้

---

## 🎯 สรุป

✅ Export ข้อมูลทั้งหมดเป็น Excel  
✅ Import ข้อมูลจาก Excel (สร้างใหม่/อัปเดต)  
✅ รองรับข้อมูล Array (คั่นด้วย comma)  
✅ แสดงผลสรุปและ errors  
✅ Transaction Safety  
✅ Authorization (admin, superadmin เท่านั้น)
