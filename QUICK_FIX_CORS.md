# ⚡ Quick Fix: CORS Error

## ปัญหา
Backend บน Railway ไม่อนุญาตให้ Vercel เรียก API

## แก้ไขด่วน (3 ขั้นตอน)

### 1. เพิ่ม Vercel URL ใน Railway

1. ไปที่ **Railway Dashboard** → เลือก project `odpc1-backend`
2. คลิก **Variables** tab
3. เพิ่ม/แก้ไข:

```
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://hrodpc1.ddc.moph.go.th
```

**⚠️ สำคัญ:**
- แทนที่ `your-vercel-app` ด้วย URL จริงของคุณ
- คั่นด้วย comma ไม่มีช่องว่าง
- ไม่ต้องมี `/` ท้าย URL

**หา Vercel URL:**
- Vercel Dashboard → เลือก project → Domains tab → copy URL

### 2. Deploy โค้ดใหม่

```bash
git add .
git commit -m "Fix CORS: allow Vercel domains"
git push origin main
```

### 3. ทดสอบ

1. รอ Railway deploy เสร็จ (1-2 นาที)
2. เปิด Vercel app
3. ลองเรียก API
4. ควรใช้งานได้แล้ว ✅

## ตรวจสอบว่าใช้งานได้

### ใน Railway Logs ควรเห็น:

```
🌍 Allowed CORS Origins: [
  'http://localhost:3000',
  'https://hrodpc1.ddc.moph.go.th',
  'https://your-vercel-app.vercel.app'
]

✅ CORS: Allowed origin: https://your-vercel-app.vercel.app
```

### ใน Browser Console (F12) ไม่ควรเห็น:

```
❌ Access to XMLHttpRequest ... has been blocked by CORS policy
```

## ถ้ายังไม่ได้

1. ตรวจสอบ URL ใน `ALLOWED_ORIGINS` ถูกต้องหรือไม่
2. Restart Railway service
3. Clear browser cache (Ctrl+Shift+R)
4. ดู `FIX_CORS_ERROR.md` สำหรับวิธีแก้แบบละเอียด

---

**ใช้เวลาแค่ 5 นาที!** 🚀
