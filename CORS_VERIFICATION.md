# 🌐 CORS Verification - ตรวจสอบการตั้งค่า CORS

## ✅ สถานะ CORS

ระบบ Express ได้ตั้งค่า CORS ให้อนุญาต Next.js (พอร์ต 3000) และ Origins อื่นๆ แล้ว

---

## 📋 Allowed Origins

### ✅ Local Development

```
http://localhost:3000      ✅ Next.js Development
http://localhost:3001      ✅ Alternative Port
http://127.0.0.1:3000      ✅ Loopback Address
```

### ✅ Production

```
https://hrodpc1.ddc.moph.go.th    ✅ Production Domain
```

### ✅ Vercel Preview Deployments

```
https://*.vercel.app              ✅ Vercel Preview URLs
```

### ✅ No Origin (Mobile Apps, Postman, curl)

```
(No origin header)                ✅ Allowed
```

---

## 🔧 CORS Configuration

### ไฟล์: `index.js`

```javascript
// Parse ALLOWED_ORIGINS from environment variable
const envOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://hrodpc1.ddc.moph.go.th',
  ...envOrigins
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      console.log('✅ CORS: No origin (allowed)');
      return callback(null, true);
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Allowed origin: ${origin}`);
      return callback(null, true);
    }

    // Check if origin matches wildcard patterns (for Vercel preview deployments)
    const isVercelPreview = origin.match(/^https:\/\/.*\.vercel\.app$/);
    if (isVercelPreview) {
      console.log(`✅ CORS: Allowed Vercel preview: ${origin}`);
      return callback(null, true);
    }

    console.warn(`⚠️ CORS blocked: ${origin}`);
    console.warn(`   Allowed origins:`, allowedOrigins);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## 🧪 วิธีการทดสอบ CORS

### ทดสอบที่ 1: ใช้ curl

```bash
# ทดสอบ GET request
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://localhost:3011/api/employees -v

# ผลลัพธ์ที่คาดหวัง:
# < HTTP/1.1 200 OK
# < Access-Control-Allow-Origin: http://localhost:3000
# < Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
# < Access-Control-Allow-Headers: Content-Type,Authorization
```

### ทดสอบที่ 2: ใช้ Postman

1. เปิด Postman
2. สร้าง Request ใหม่
3. ตั้งค่า Headers:
   ```
   Origin: http://localhost:3000
   ```
4. ส่ง GET request ไปที่:
   ```
   http://localhost:3011/api/employees
   ```
5. ตรวจสอบ Response Headers:
   ```
   Access-Control-Allow-Origin: http://localhost:3000
   ```

### ทดสอบที่ 3: ใช้ Browser Console

```javascript
// ทดสอบจาก http://localhost:3000
fetch('http://localhost:3011/api/employees', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
.then(response => {
  console.log('✅ CORS Success!');
  console.log('Status:', response.status);
  console.log('Headers:', response.headers);
  return response.json();
})
.then(data => {
  console.log('✅ Data received:', data);
})
.catch(error => {
  console.error('❌ CORS Error:', error);
});
```

### ทดสอบที่ 4: ใช้ Next.js

```javascript
// pages/api/test-cors.js
export default async function handler(req, res) {
  try {
    const response = await fetch('http://localhost:3011/api/employees', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    
    res.status(200).json({
      success: true,
      message: '✅ CORS working!',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ CORS Error',
      error: error.message
    });
  }
}
```

---

## 📊 CORS Headers ที่ส่งกลับ

### Response Headers

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
Access-Control-Allow-Headers: Content-Type,Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

### ความหมาย

| Header | ความหมาย |
|--------|---------|
| `Access-Control-Allow-Origin` | Origins ที่อนุญาต |
| `Access-Control-Allow-Methods` | HTTP Methods ที่อนุญาต |
| `Access-Control-Allow-Headers` | Headers ที่อนุญาต |
| `Access-Control-Allow-Credentials` | อนุญาต Cookies/Credentials |
| `Access-Control-Max-Age` | เวลา Cache (วินาที) |

---

## 🔍 ตรวจสอบ CORS ใน Browser DevTools

### ขั้นตอนที่ 1: เปิด DevTools

```
F12 หรือ Ctrl+Shift+I (Windows)
Cmd+Option+I (Mac)
```

### ขั้นตอนที่ 2: ไปที่ Network Tab

1. เปิด Network Tab
2. ส่ง Request ไปที่ Backend API
3. ตรวจสอบ Response Headers

### ขั้นตอนที่ 3: ตรวจสอบ CORS Headers

```
Response Headers:
✅ access-control-allow-origin: http://localhost:3000
✅ access-control-allow-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
✅ access-control-allow-headers: Content-Type,Authorization
✅ access-control-allow-credentials: true
```

---

## ⚠️ CORS Errors และวิธีแก้

### Error 1: No 'Access-Control-Allow-Origin' header

```
❌ Access to XMLHttpRequest at 'http://localhost:3011/api/employees' 
   from origin 'http://localhost:3000' has been blocked by CORS policy: 
   No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**สาเหตุ:** Backend ไม่ส่ง CORS headers

**วิธีแก้:**
1. ตรวจสอบว่า `cors()` middleware ถูกเพิ่มใน `index.js`
2. ตรวจสอบว่า Origin อยู่ใน `allowedOrigins`
3. รีสตาร์ท Backend Server

### Error 2: The value of the 'Access-Control-Allow-Credentials' header

```
❌ Access to XMLHttpRequest at 'http://localhost:3011/api/employees' 
   from origin 'http://localhost:3000' has been blocked by CORS policy: 
   The value of the 'Access-Control-Allow-Credentials' header in the response 
   is '' which must be 'true' when the request's credentials mode is 'include'.
```

**สาเหตุ:** ส่ง `credentials: 'include'` แต่ Backend ไม่อนุญาต

**วิธีแก้:**
```javascript
// ตรวจสอบว่า corsOptions มี:
credentials: true
```

### Error 3: Method not allowed

```
❌ Access to XMLHttpRequest at 'http://localhost:3011/api/employees' 
   from origin 'http://localhost:3000' has been blocked by CORS policy: 
   Method POST is not allowed by Access-Control-Allow-Methods.
```

**สาเหตุ:** HTTP Method ไม่อยู่ใน `allowedMethods`

**วิธีแก้:**
```javascript
// ตรวจสอบว่า corsOptions มี:
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
```

---

## 🔐 CORS Security Best Practices

### ✅ ทำ

- ✅ ระบุ Origins ที่ชัดเจน (ไม่ใช้ `*`)
- ✅ ใช้ HTTPS ใน Production
- ✅ ตรวจสอบ Origin ทุกครั้ง
- ✅ ใช้ Credentials อย่างระมัดระวัง
- ✅ ตั้งค่า Max-Age ให้เหมาะสม

### ❌ อย่าทำ

- ❌ ไม่ใช้ `Access-Control-Allow-Origin: *` ใน Production
- ❌ ไม่อนุญาต Credentials กับ `*`
- ❌ ไม่ตรวจสอบ Origin
- ❌ ไม่ใช้ HTTPS ใน Production

---

## 📝 ตัวอย่างการใช้งาน

### ตัวอย่าง 1: Fetch API

```javascript
// Frontend (Next.js)
const fetchEmployees = async () => {
  try {
    const response = await fetch('http://localhost:3011/api/employees', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // ส่ง Cookies
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Employees:', data);
    return data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
};
```

### ตัวอย่าง 2: Axios

```javascript
import axios from 'axios';

const fetchEmployees = async () => {
  try {
    const response = await axios.get('http://localhost:3011/api/employees', {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true // ส่ง Cookies
    });

    console.log('✅ Employees:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error:', error);
  }
};
```

### ตัวอย่าง 3: React Query

```javascript
import { useQuery } from '@tanstack/react-query';

const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3011/api/employees', {
        credentials: 'include'
      });
      return response.json();
    }
  });
};
```

---

## 🎯 Checklist

- [ ] Backend Server ทำงานที่พอร์ต 3011
- [ ] Frontend Server ทำงานที่พอร์ต 3000
- [ ] CORS middleware ถูกเพิ่มใน `index.js`
- [ ] `allowedOrigins` รวม `http://localhost:3000`
- [ ] `methods` รวม `GET`, `POST`, `PUT`, `DELETE`, `PATCH`, `OPTIONS`
- [ ] `allowedHeaders` รวม `Content-Type`, `Authorization`
- [ ] `credentials: true` ถูกตั้งค่า
- [ ] ทดสอบ CORS ด้วย curl หรือ Postman
- [ ] ทดสอบ CORS ด้วย Browser DevTools
- [ ] ทดสอบ CORS ด้วย Frontend Application

---

## 📞 ติดต่อ

หากมีปัญหา CORS โปรดตรวจสอบ:
- `index.js` - CORS Configuration
- `LOCALHOST_SETUP.md` - Localhost Setup Guide
- `FIX_CORS_ERROR.md` - CORS Error Fixes

---

**ขอให้ CORS ทำงานได้อย่างราบรื่น! 🌐**
