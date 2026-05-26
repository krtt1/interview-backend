# 🚀 Deploy Instructions

## ขั้นตอนการ Deploy

### 1. Commit Changes

```bash
git add .
git commit -m "Add detailed error logging for meeting create debugging"
git push origin main
```

### 2. รอ Railway Auto-Deploy

- ไปที่ Railway Dashboard
- ดู Deployments tab
- รอจนกว่า status จะเป็น "Active" (ประมาณ 2-3 นาที)

### 3. ตรวจสอบ Logs

คลิก **View logs** แล้วดูว่ามี:

```
✅ Database connected successfully
📊 Database: railway
🔗 Host: ...
🚀 Server listening on port ...
```

### 4. ทดสอบ API

```bash
# Health Check
curl https://odpc1-backend-production.up.railway.app/api/health

# ควรได้
{
  "status": "ok",
  "database": {
    "status": "connected"
  }
}
```

### 5. ทดสอบสร้าง Meeting

1. เปิด Frontend
2. ลองสร้าง meeting ใหม่
3. ถ้าได้ 500 error:
   - เปิด Browser Console (F12)
   - ดู Network tab → Request/Response
   - ไปดู Railway Logs
   - ค้นหา `========== [timestamp] Meeting Create Request ==========`
   - ดู error message

### 6. ส่งข้อมูล Debug

ถ้ายังไม่ได้ ส่งมา:

1. **Railway Logs** - copy ตั้งแต่ `========== Meeting Create Request ==========` ถึง `========== Request Failed ==========`
2. **Frontend Payload** - จาก Network tab → Request
3. **Error Response** - จาก Network tab → Response

## สิ่งที่เปลี่ยนแปลง

### 1. `controllers/meetingController.js`
- เพิ่ม request ID สำหรับ tracking
- เพิ่ม detailed logging
- เพิ่ม error categorization
- เพิ่ม duration tracking

### 2. `services/meetingService.js`
- เพิ่ม validation ก่อน transaction
- เพิ่ม transaction timeout (30s)
- เพิ่ม employee validation timeout (10s)
- ปรับปรุง participant filtering
- เพิ่ม error handling

### 3. `config/database.js`
- ลด pool size (10)
- เพิ่ม connection timeout
- เพิ่ม query timeout
- เพิ่ม detailed error logging

## Expected Logs

### Success Case

```
========== [1234567890] Meeting Create Request ==========
[1234567890] 📥 Received payload: {...}
[1234567890] 👤 User: 6609900001 admin
[1234567890] 🌍 Environment: production
[1234567890] 🔍 Field validation: { all true }
[1234567890] ✅ Validation passed, calling service...
📝 Creating meeting with data: {...}
✅ Meeting created: 1
👥 Processing participants: 2 total
✅ Valid participant IDs: 2
✅ Added 2 participants to meeting
✅ Transaction committed successfully (1234ms)
[1234567890] ✅ Meeting created successfully in 1234ms: 1
========== [1234567890] Request Complete ==========
```

### Error Case

```
========== [1234567890] Meeting Create Request ==========
[1234567890] 📥 Received payload: {...}
[1234567890] ❌ Meeting Create Error (500ms): ...
[1234567890] Error name: SequelizeTimeoutError
[1234567890] SQL Error Code: ETIMEDOUT
========== [1234567890] Request Failed ==========
```

## Troubleshooting

### ถ้า Deploy ล้มเหลว

```bash
# ตรวจสอบ git status
git status

# ตรวจสอบ remote
git remote -v

# Force push (ถ้าจำเป็น)
git push origin main --force
```

### ถ้า Railway ไม่ Auto-Deploy

1. ไปที่ Railway Dashboard
2. คลิก **Manual Deploy**
3. เลือก **Deploy latest commit**

### ถ้า Database ไม่ Connect

1. ตรวจสอบ MYSQL_PUBLIC_URL ใน Railway Variables
2. ตรวจสอบ Database status ใน Railway
3. Restart service

---

**Next Steps:**
1. Deploy โค้ด
2. ดู Railway Logs
3. ทดสอบสร้าง meeting
4. ส่ง logs มาถ้ายังไม่ได้

---

**อัพเดทล่าสุด:** 2025-01-20
