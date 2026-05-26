# 🔧 แก้ไข CORS Error - Railway ไม่อนุญาตให้ Vercel เรียก API

## ปัญหาที่พบ

```
Access to XMLHttpRequest at 'https://odpc1-backend-production.up.railway.app/...' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

## สาเหตุ

Backend บน Railway ไม่มี Vercel URL ใน `allowedOrigins`

## การแก้ไขที่ทำไปแล้ว

### 1. ✅ ปรับปรุง CORS Configuration

**เปลี่ยนแปลง:**
- Parse `ALLOWED_ORIGINS` จาก environment variable (comma-separated)
- เพิ่ม wildcard pattern สำหรับ Vercel preview deployments (`*.vercel.app`)
- เพิ่ม logging เพื่อ debug
- เพิ่ม `optionsSuccessStatus: 200` สำหรับ legacy browsers

**ตอนนี้รองรับ:**
- ✅ `http://localhost:3000` (local development)
- ✅ `https://hrodpc1.ddc.moph.go.th` (production)
- ✅ `https://your-app.vercel.app` (Vercel production)
- ✅ `https://your-app-*.vercel.app` (Vercel preview deployments)
- ✅ URLs จาก `ALLOWED_ORIGINS` environment variable

## ขั้นตอนการแก้ไข

### Step 1: เพิ่ม Vercel URL ใน Railway Environment Variables

1. ไปที่ **Railway Dashboard**
2. เลือก project: `odpc1-backend`
3. คลิก **Variables** tab
4. เพิ่ม/แก้ไข variable:

```
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://hrodpc1.ddc.moph.go.th
```

**หมายเหตุ:**
- คั่นด้วย comma (`,`) ไม่มีช่องว่าง
- ไม่ต้องมี trailing slash (`/`)
- ใส่ทั้ง production และ preview URLs

**ตัวอย่าง:**
```
ALLOWED_ORIGINS=https://next-vanacourt-admin.vercel.app,https://hrodpc1.ddc.moph.go.th
```

### Step 2: Deploy โค้ดใหม่

```bash
git add .
git commit -m "Fix CORS: allow Vercel domains and improve logging"
git push origin main
```

### Step 3: Restart Railway Service (ถ้าจำเป็น)

1. Railway Dashboard → Settings
2. คลิก **Restart**
3. รอ 1-2 นาที

### Step 4: ตรวจสอบ Logs

ใน Railway Logs ควรเห็น:

```
🌍 Allowed CORS Origins: [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://hrodpc1.ddc.moph.go.th',
  'https://your-vercel-app.vercel.app'
]
```

### Step 5: ทดสอบจาก Vercel

1. เปิด Vercel app
2. เปิด Browser Console (F12)
3. ลองเรียก API
4. ควรเห็นใน Railway Logs:

```
✅ CORS: Allowed origin: https://your-vercel-app.vercel.app
```

**ถ้ายังถูก block:**
```
⚠️ CORS blocked: https://your-vercel-app.vercel.app
   Allowed origins: [...]
```

## การตรวจสอบปัญหา

### 1. ตรวจสอบ Vercel URL

**หา Vercel URL:**
1. ไปที่ Vercel Dashboard
2. เลือก project
3. คลิก **Domains** tab
4. Copy production URL (เช่น `https://your-app.vercel.app`)

**ตรวจสอบว่า URL ถูกต้อง:**
- ✅ `https://your-app.vercel.app` (ถูกต้อง)
- ❌ `https://your-app.vercel.app/` (มี trailing slash)
- ❌ `http://your-app.vercel.app` (ไม่มี https)

### 2. ตรวจสอบ Railway Environment Variables

```bash
# ใน Railway Dashboard → Variables
ALLOWED_ORIGINS=https://your-app.vercel.app,https://hrodpc1.ddc.moph.go.th
```

**ตรวจสอบ:**
- ✅ ไม่มีช่องว่างรอบ comma
- ✅ ไม่มี trailing slash
- ✅ ใช้ https (ไม่ใช่ http)
- ✅ ไม่มี quotes (`"` หรือ `'`)

### 3. ตรวจสอบ Browser Console

เปิด Browser Console (F12) → Network tab:

**ถ้าเห็น:**
```
Access-Control-Allow-Origin: https://your-app.vercel.app
```
✅ CORS ทำงานถูกต้อง

**ถ้าไม่เห็น header นี้:**
❌ CORS ยังไม่ทำงาน

### 4. ทดสอบด้วย curl

```bash
# ทดสอบ preflight request
curl -X OPTIONS https://odpc1-backend-production.up.railway.app/api/employees/public/summary \
  -H "Origin: https://your-vercel-app.vercel.app" \
  -H "Access-Control-Request-Method: GET" \
  -v

# ควรเห็น
< Access-Control-Allow-Origin: https://your-vercel-app.vercel.app
< Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS
```

## Vercel Preview Deployments

Vercel สร้าง preview URL ใหม่ทุกครั้งที่ push (เช่น `https://your-app-abc123.vercel.app`)

**โค้ดใหม่รองรับอัตโนมัติ:**
```javascript
// ใน index.js
const isVercelPreview = origin.match(/^https:\/\/.*\.vercel\.app$/);
if (isVercelPreview) {
  console.log(`✅ CORS: Allowed Vercel preview: ${origin}`);
  return callback(null, true);
}
```

**ไม่ต้องเพิ่ม preview URLs ใน ALLOWED_ORIGINS**

## Alternative: Allow All Origins (ไม่แนะนำสำหรับ Production)

ถ้าต้องการ allow ทุก origin (สำหรับ development/testing):

```javascript
// ใน index.js (ไม่แนะนำ)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**⚠️ อันตราย:**
- ทุกเว็บสามารถเรียก API ได้
- ไม่ปลอดภัยสำหรับ production
- ใช้เฉพาะ development เท่านั้น

## Checklist

- [ ] เพิ่ม Vercel URL ใน Railway `ALLOWED_ORIGINS`
- [ ] Deploy โค้ดใหม่
- [ ] Restart Railway service (ถ้าจำเป็น)
- [ ] ตรวจสอบ Railway Logs
- [ ] ทดสอบจาก Vercel
- [ ] ตรวจสอบ Browser Console
- [ ] ทดสอบ preview deployments

## ตัวอย่าง Environment Variables

### Development
```env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Production
```env
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://hrodpc1.ddc.moph.go.th
```

### Multiple Domains
```env
ALLOWED_ORIGINS=https://app1.vercel.app,https://app2.vercel.app,https://custom-domain.com
```

## ถ้ายังไม่ได้

### 1. ตรวจสอบ Railway Logs

ค้นหา:
```
⚠️ CORS blocked: https://your-vercel-app.vercel.app
```

ถ้าเจอ → URL ไม่อยู่ใน allowed list

### 2. ตรวจสอบ Vercel Logs

ดูว่า request ถูกส่งไปที่ URL ไหน:
```
POST https://odpc1-backend-production.up.railway.app/...
```

### 3. Clear Cache

- Clear browser cache
- Hard refresh (Ctrl+Shift+R)
- ลองใน Incognito mode

### 4. ตรวจสอบ Vercel Environment Variables

ใน Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://odpc1-backend-production.up.railway.app
```

ต้องตรงกับ Railway URL

## Tips

### 1. ใช้ Environment Variable ใน Frontend

```typescript
// ใน Frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011';

axios.get(`${API_URL}/api/employees/public/summary`);
```

### 2. เพิ่ม Error Handling

```typescript
try {
  const response = await axios.get('/api/...');
} catch (error) {
  if (error.message.includes('CORS')) {
    console.error('CORS Error - Backend ไม่อนุญาตให้เรียก API');
  }
}
```

### 3. ตรวจสอบ Network Tab

Browser Console → Network tab → เลือก request → Headers:
- Request Headers → `Origin: https://your-app.vercel.app`
- Response Headers → `Access-Control-Allow-Origin: ...`

---

**สรุป:**
1. เพิ่ม Vercel URL ใน Railway `ALLOWED_ORIGINS`
2. Deploy โค้ดใหม่
3. ทดสอบจาก Vercel

ควรจะใช้ได้แล้ว! 🚀

---

**อัพเดทล่าสุด:** 2025-01-20
