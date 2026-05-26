# 📊 ระบบจัดการสมรรถนะบุคลากร (Capacity Management System)

## ✅ สถานะ: พร้อมใช้งาน

ระบบสมรรถนะบุคลากรได้ถูกสร้างเสร็จสมบูรณ์แล้ว พร้อมใช้งานทันที!

---

## 🎯 ภาพรวมระบบ

ระบบนี้ออกแบบมาเพื่อเก็บข้อมูลสมรรถนะ ทักษะ ความสามารถ ประสบการณ์ และคุณสมบัติเฉพาะของบุคลากรในองค์กร สคร.1

### คุณสมบัติหลัก
- ✅ เก็บข้อมูลสมรรถนะครบถ้วน 80+ ฟิลด์
- ✅ รองรับข้อมูลที่เลือกได้มากกว่า 1 ข้อ (Multiple Selection)
- ✅ ระบบ Authorization ตาม Role (admin, superadmin, user)
- ✅ Transaction Safety (Rollback เมื่อเกิดข้อผิดพลาด)
- ✅ RESTful API ที่ใช้งานง่าย
- ✅ **Import/Export Excel** ✨ NEW
- ✅ เอกสารครบถ้วน พร้อมตัวอย่าง

---

## 📋 โครงสร้างฐานข้อมูล

### ตารางหลัก
**tb_capacity** - เก็บข้อมูลสมรรถนะหลัก (80+ ฟิลด์)

### ตารางเสริม (สำหรับข้อมูลที่เลือกได้มากกว่า 1 ข้อ)
1. **tb_capacity_training_courses** - หลักสูตร/ประสบการณ์ที่ผ่าน (18 ตัวเลือก)
2. **tb_capacity_vector_courses** - หลักสูตรโรคติดต่อนำโดยแมลง (4 ตัวเลือก)
3. **tb_capacity_envocc_courses** - หลักสูตร EnvOcc (8 ตัวเลือก)
4. **tb_capacity_law_courses** - หลักสูตรกฎหมาย (6 ตัวเลือก)
5. **tb_capacity_other_experiences** - ประสบการณ์อื่นๆ (4 ตัวเลือก)

---

## 📡 API Endpoints

| Method | Endpoint | Authorization | คำอธิบาย |
|--------|----------|---------------|----------|
| POST | `/api/capacity/:id` | admin, superadmin | สร้าง/อัปเดตข้อมูลสมรรถนะ |
| GET | `/api/capacity/:id` | ทุก role | ดึงข้อมูลสมรรถนะตาม employee_id |
| GET | `/api/capacity` | ทุก role | ดึงข้อมูลสมรรถนะทั้งหมด |
| DELETE | `/api/capacity/:id` | admin, superadmin | ลบข้อมูลสมรรถนะ |
| **GET** | **`/api/capacity/export`** | **admin, superadmin** | **Export ข้อมูลเป็น Excel** |
| **POST** | **`/api/capacity/import`** | **admin, superadmin** | **Import ข้อมูลจาก Excel** |

---

## 📁 ไฟล์ที่สร้าง

### Models (6 ไฟล์)
- `models/capacity.js` - โมเดลหลัก
- `models/capacityTrainingCourses.js` - หลักสูตรที่ผ่าน
- `models/capacityVectorCourses.js` - หลักสูตรโรคติดต่อนำโดยแมลง
- `models/capacityEnvoccCourses.js` - หลักสูตร EnvOcc
- `models/capacityLawCourses.js` - หลักสูตรกฎหมาย
- `models/capacityOtherExperiences.js` - ประสบการณ์อื่นๆ

### Service Layer
- `services/capacityService.js` - Business logic

### Controller
- `controllers/capacityController.js` - HTTP request handlers

### Routes
- `routes/capacityRoutes.js` - API endpoints

### Documentation (7 ไฟล์)
- `docs/CAPACITY_README.md` - เอกสารสรุป (ไฟล์นี้)
- `docs/CAPACITY_API_GUIDE.md` - คู่มือ API ฉบับสมบูรณ์
- `docs/CAPACITY_FIELDS_LIST.md` - รายการฟิลด์ทั้งหมด
- `docs/CAPACITY_FRONTEND_GUIDE.md` - คู่มือสำหรับ Frontend Developer
- `docs/CAPACITY_TESTING_GUIDE.md` - คู่มือการทดสอบ
- `docs/CAPACITY_IMPORT_EXPORT_GUIDE.md` - คู่มือ Import/Export Excel ✨ NEW
- `docs/CAPACITY_EXCEL_TEMPLATE.md` - คู่มือรูปแบบไฟล์ Excel ✨ NEW

---

## 🚀 วิธีการใช้งาน

### 1. สำหรับ Backend Developer

#### ตรวจสอบว่าระบบพร้อมใช้งาน
```bash
# ตรวจสอบว่าไม่มี syntax errors
npm run dev
```

#### ทดสอบ API
```bash
# ใช้ Postman หรือ curl
curl -X GET http://localhost:3000/api/capacity \
  -H "Authorization: Bearer <your_token>"
```

### 2. สำหรับ Frontend Developer

#### ติดตั้ง Dependencies
```bash
npm install axios
# หรือ
npm install fetch
```

#### ตัวอย่างการใช้งาน
```javascript
// สร้าง/อัปเดตข้อมูล
const response = await fetch('http://localhost:3000/api/capacity/1234567890123', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    full_name: "สมชาย ใจดี",
    department: "กลุ่มงานระบาดวิทยา",
    trainingCourses: [
      "หลักสูตรระบาดวิทยาก่อนปฏิบัติการ",
      "หลักสูตร FETP"
    ]
  })
});

const data = await response.json();
console.log(data);
```

**อ่านเพิ่มเติม:** [CAPACITY_FRONTEND_GUIDE.md](./CAPACITY_FRONTEND_GUIDE.md)

---

## 📚 เอกสารแนะนำ

### สำหรับ Backend Developer
1. **[CAPACITY_API_GUIDE.md](./CAPACITY_API_GUIDE.md)** - เอกสาร API ฉบับสมบูรณ์
   - API Endpoints ทั้งหมด
   - Request/Response Examples
   - Error Handling
   - Business Rules

2. **[CAPACITY_TESTING_GUIDE.md](./CAPACITY_TESTING_GUIDE.md)** - คู่มือการทดสอบ
   - Test Cases ทั้งหมด
   - Postman Examples
   - Database Verification
   - Checklist

### สำหรับ Frontend Developer
1. **[CAPACITY_FRONTEND_GUIDE.md](./CAPACITY_FRONTEND_GUIDE.md)** - คู่มือ Frontend
   - Vanilla JavaScript Examples
   - React.js Examples
   - Vue.js Examples
   - Tips & Best Practices

2. **[CAPACITY_FIELDS_LIST.md](./CAPACITY_FIELDS_LIST.md)** - รายการฟิลด์ทั้งหมด
   - ฟิลด์ทั้งหมด 80+ ฟิลด์
   - ความหมายของแต่ละฟิลด์
   - ตัวเลือกสำหรับ Array Fields

3. **[CAPACITY_IMPORT_EXPORT_GUIDE.md](./CAPACITY_IMPORT_EXPORT_GUIDE.md)** - คู่มือ Import/Export ✨ NEW
   - วิธีการ Export ข้อมูลเป็น Excel
   - วิธีการ Import ข้อมูลจาก Excel
   - ตัวอย่างโค้ด Frontend
   - Tips & Best Practices

4. **[CAPACITY_EXCEL_TEMPLATE.md](./CAPACITY_EXCEL_TEMPLATE.md)** - คู่มือรูปแบบไฟล์ Excel ✨ NEW
   - โครงสร้างไฟล์ Excel
   - คำอธิบายแต่ละคอลัมน์
   - ตัวอย่างข้อมูล
   - ข้อควรระวัง

---

## 🔒 Authorization

### สิทธิ์การเข้าถึง
- **admin, superadmin**: สร้าง, อ่าน, แก้ไข, ลบ
- **user**: อ่านเท่านั้น

### ตัวอย่างการใช้งาน
```javascript
// ต้องมี token ในทุก request
headers: {
  'Authorization': `Bearer ${token}`
}
```

---

## 💡 Tips & Best Practices

### 1. การส่งข้อมูล Array
```javascript
// ✅ ถูกต้อง
{
  trainingCourses: ["หลักสูตร A", "หลักสูตร B"]
}

// ❌ ผิด
{
  trainingCourses: "หลักสูตร A, หลักสูตร B"
}
```

### 2. การอัปเดตข้อมูล
เมื่ออัปเดต Array จะลบข้อมูลเก่าทั้งหมดและสร้างใหม่ ดังนั้นต้องส่งข้อมูลครบทุกรายการที่ต้องการเก็บ

### 3. Transaction Safety
ระบบใช้ transaction ในทุกการเปลี่ยนแปลงข้อมูล ถ้า step ใดผิดพลาด จะ rollback ทั้งหมด

---

## 🧪 การทดสอบ

### Quick Test
```bash
# 1. สร้างข้อมูล
POST http://localhost:3000/api/capacity/1234567890123

# 2. ดึงข้อมูล
GET http://localhost:3000/api/capacity/1234567890123

# 3. อัปเดตข้อมูล
POST http://localhost:3000/api/capacity/1234567890123

# 4. ลบข้อมูล
DELETE http://localhost:3000/api/capacity/1234567890123
```

**อ่านเพิ่มเติม:** [CAPACITY_TESTING_GUIDE.md](./CAPACITY_TESTING_GUIDE.md)

---

## ⚠️ ข้อควรระวัง

1. **Employee ID**: ต้องมี employee ในระบบก่อนจึงจะสร้างข้อมูลสมรรถนะได้
2. **Array Fields**: ต้องส่งเป็น array เสมอ ไม่ใช่ string
3. **Authorization**: ต้องมี token ที่ถูกต้องในทุก request
4. **Update Behavior**: การอัปเดต array จะลบข้อมูลเก่าทั้งหมด

---

## 🎯 สรุป

✅ ระบบสมรรถนะบุคลากรพร้อมใช้งาน  
✅ เก็บข้อมูลครบถ้วน 80+ ฟิลด์  
✅ รองรับ Multiple Selection (Array)  
✅ Transaction Safety และ Authorization  
✅ เอกสารครบถ้วน พร้อมตัวอย่าง  
✅ ทดสอบแล้ว ไม่มี errors

---

## 📞 ติดต่อ

หากมีคำถามหรือพบปัญหา กรุณาติดต่อทีมพัฒนา

---

**เอกสารนี้สร้างโดย:** Kiro AI Assistant  
**วันที่:** 6 กุมภาพันธ์ 2026  
**เวอร์ชัน:** 1.0.0
