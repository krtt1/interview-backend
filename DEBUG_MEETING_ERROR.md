# 🔍 Debug Meeting Create 500 Error

## ขั้นตอนการ Debug

### 1. ตรวจสอบ Railway Logs

ไปที่ **Railway Dashboard → Logs** แล้วกด **View logs**

ค้นหา log messages เหล่านี้:

```
========== [timestamp] Meeting Create Request ==========
📥 Received payload: {...}
👤 User: ...
🌍 Environment: production
🔍 Field validation: {...}
```

**ถ้าเห็น:**
- `❌ Missing required fields` → Frontend ส่งข้อมูลไม่ครบ
- `❌ Meeting Create Error` → ดู error message ด้านล่าง
- `SQL Error Code` → Database error

### 2. ทดสอบ Health Check

```bash
curl https://odpc1-backend-production.up.railway.app/api/health
```

**ผลลัพธ์ที่คาดหวัง:**
```json
{
  "status": "ok",
  "database": {
    "status": "connected",
    "pool": {
      "size": 10,
      "available": 8,
      "using": 2,
      "waiting": 0
    }
  }
}
```

**ถ้าได้:**
- `"status": "error"` → Database ไม่ online
- `"database": { "status": "disconnected" }` → Connection ล้มเหลว
- `pool.available = 0` → Connection pool เต็ม

### 3. ทดสอบสร้าง Meeting ด้วย curl

```bash
# ต้องมี token ก่อน (login)
TOKEN="your-jwt-token-here"

curl -X POST https://odpc1-backend-production.up.railway.app/meeting/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "start_date": "2025-01-25",
    "end_date": "2025-01-26",
    "topic": "ทดสอบ",
    "meeting_title": "ประชุมทดสอบ",
    "organizer": "ผู้จัด",
    "meeting_type": "Online",
    "location": "ห้องประชุม",
    "budget_source": "งบประมาณ",
    "note": "หมายเหตุ",
    "participants": [],
    "submit_date": "2025-01-30"
  }'
```

**ถ้าสำเร็จ:**
```json
{
  "meeting_id": 1,
  "meeting_title": "ประชุมทดสอบ",
  ...
}
```

**ถ้าล้มเหลว:**
```json
{
  "error": "error message",
  "requestId": 1234567890
}
```

ใช้ `requestId` ค้นหาใน Railway Logs

### 4. ตรวจสอบ Frontend Payload

เปิด Browser Console (F12) → Network tab → ดู Request Payload:

```javascript
// ✅ ถูกต้อง
{
  "start_date": "2025-01-25",
  "end_date": "2025-01-26",
  "topic": "หัวข้อ",
  "meeting_title": "ชื่อประชุม",
  "organizer": "ผู้จัด",
  "meeting_type": "Online",
  "participants": ["6609900001", "6609900002"],
  "submit_date": "2025-01-30"
}

// ❌ ผิด - missing fields
{
  "start_date": "",
  "topic": null,
  ...
}

// ❌ ผิด - wrong meeting_type
{
  "meeting_type": "online" // ต้องเป็น "Online" (capital O)
}

// ❌ ผิด - invalid participants
{
  "participants": [null, "", undefined]
}
```

## Error Messages และสาเหตุ

### 1. "กรุณากรอกข้อมูลให้ครบถ้วน"

**สาเหตุ:** Frontend ส่งข้อมูลไม่ครบ

**ตรวจสอบ:**
- ดู Railway Logs → `missing` object
- ตรวจสอบ Frontend form validation

**วิธีแก้:**
```typescript
// ใน Frontend - validate ก่อนส่ง
if (!formData.start_date || !formData.end_date || !formData.topic || 
    !formData.meeting_title || !formData.organizer || !formData.meeting_type) {
  toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
  return;
}
```

### 2. "ข้อมูลพนักงานไม่ถูกต้อง"

**สาเหตุ:** Participant ID ไม่มีในตาราง tb_employee

**ตรวจสอบ:**
```sql
-- ใน Railway MySQL
SELECT id FROM tb_employee WHERE id IN ('6609900001', '6609900002');
```

**วิธีแก้:**
- ตรวจสอบว่า employee_id ถูกต้อง
- ตรวจสอบว่ามี employee ในระบบ

### 3. "การสร้างการประชุมใช้เวลานานเกินไป"

**สาเหตุ:** Transaction timeout (30 วินาที)

**ตรวจสอบ:**
- ดู Railway Logs → duration time
- ตรวจสอบ database performance

**วิธีแก้:**
- ลดจำนวน participants
- เพิ่ม database index
- ตรวจสอบ slow queries

### 4. "ไม่สามารถเชื่อมต่อฐานข้อมูลได้"

**สาเหตุ:** Database connection error

**ตรวจสอบ:**
- Railway Dashboard → Database status
- ตรวจสอบ MYSQL_PUBLIC_URL

**วิธีแก้:**
- Restart Railway service
- ตรวจสอบ database credentials
- ตรวจสอบ connection pool

## Common Issues

### Issue 1: Pool Exhausted

**อาการ:**
```
Error: Connection pool exhausted
```

**สาเหตุ:** Connection pool เต็ม (max: 10)

**วิธีแก้:**
1. ตรวจสอบ connection leaks
2. เพิ่ม pool size (ถ้า Railway อนุญาต)
3. ลด acquire timeout

### Issue 2: Transaction Deadlock

**อาการ:**
```
Error: Deadlock found when trying to get lock
```

**สาเหตุ:** Multiple transactions lock กัน

**วิธีแก้:**
1. ลด transaction scope
2. ใช้ retry logic
3. ตรวจสอบ concurrent requests

### Issue 3: Validation Error

**อาการ:**
```
Validation Error: meeting_type must be one of: Onsite, Online
```

**สาเหตุ:** ข้อมูลไม่ตรงกับ ENUM

**วิธีแก้:**
```typescript
// ใน Frontend
const meetingType = formData.meeting_type === 'onsite' ? 'Onsite' : 'Online';
```

## Quick Fixes

### Fix 1: ลดจำนวน Participants

ถ้าสร้าง meeting กับ participants เยอะ (>50 คน) ให้:

1. สร้าง meeting ก่อน (ไม่ใส่ participants)
2. เพิ่ม participants ทีหลังด้วย `/meeting/:id/participants`

```typescript
// Step 1: Create meeting
const meeting = await axios.post('/meeting/create', {
  ...meetingData,
  participants: [] // ไม่ใส่
});

// Step 2: Add participants
await axios.post(`/meeting/${meeting.data.meeting_id}/participants`, {
  employee_ids: participantIds,
  submit_date: submitDate
});
```

### Fix 2: เพิ่ม Retry Logic

```typescript
const createMeetingWithRetry = async (data, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await axios.post('/meeting/create', data);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      if (error.response?.status === 504 || error.response?.status === 503) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw error;
    }
  }
};
```

### Fix 3: แยก Transaction

ถ้า participants เยอะมาก ให้แยก transaction:

```javascript
// ใน meetingService.js
// แทนที่จะ bulkCreate ทั้งหมด
// ให้ insert เป็น batch

const BATCH_SIZE = 50;
for (let i = 0; i < existingIds.length; i += BATCH_SIZE) {
  const batch = existingIds.slice(i, i + BATCH_SIZE);
  const rows = batch.map(employee_id => ({
    meeting_id: meeting.meeting_id,
    employee_id,
    submit_date: submit_date || null,
    tracking_status: 'อยู่ระหว่างติดตาม'
  }));
  
  await MeetingEmployee.bulkCreate(rows, { 
    transaction: t,
    validate: true,
    ignoreDuplicates: true
  });
}
```

## ขั้นตอนการแก้ไขแบบเป็นระบบ

1. ✅ ดู Railway Logs → หา error message
2. ✅ ทดสอบ health check → ตรวจสอบ database
3. ✅ ทดสอบด้วย curl → ตรวจสอบ API
4. ✅ ตรวจสอบ Frontend payload → ตรวจสอบข้อมูล
5. ✅ แก้ไขตาม error message
6. ✅ Deploy และทดสอบใหม่

## ต้องการความช่วยเหลือ?

ส่งข้อมูลเหล่านี้มา:

1. **Railway Logs** (copy ทั้งหมดตั้งแต่ `========== Meeting Create Request ==========`)
2. **Frontend Payload** (จาก Network tab)
3. **Error Response** (จาก Network tab → Response)
4. **Health Check Result** (จาก `/api/health`)

---

**อัพเดทล่าสุด:** 2025-01-20
