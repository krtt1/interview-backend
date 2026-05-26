# 🧪 API Testing Examples

## 📋 Quick Reference

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/job-title/public/getall` | GET | ❌ | Get all job titles |
| `/position-level/public/getall` | GET | ❌ | Get all position levels |
| `/position-type/public/getall` | GET | ❌ | Get all position types |
| `/jobgroup/public/getall` | GET | ❌ | Get all job groups |
| `/api/health` | GET | ❌ | Health check |
| `/` | GET | ❌ | Server status |

---

## 🔧 cURL Examples

### Test Job Titles
```bash
curl -X GET http://localhost:3011/job-title/public/getall
```

### Test Position Levels
```bash
curl -X GET http://localhost:3011/position-level/public/getall
```

### Test Position Types
```bash
curl -X GET http://localhost:3011/position-type/public/getall
```

### Test Job Groups
```bash
curl -X GET http://localhost:3011/jobgroup/public/getall
```

### Health Check
```bash
curl -X GET http://localhost:3011/api/health
```

### Server Status
```bash
curl -X GET http://localhost:3011/
```

---

## 🌐 Browser Testing

### 1. Open Browser Console
Press `F12` to open DevTools

### 2. Test with Fetch API
```javascript
// Test Job Titles
fetch('http://localhost:3011/job-title/public/getall')
  .then(r => r.json())
  .then(data => console.log('Job Titles:', data))
  .catch(err => console.error('Error:', err));

// Test Position Levels
fetch('http://localhost:3011/position-level/public/getall')
  .then(r => r.json())
  .then(data => console.log('Position Levels:', data))
  .catch(err => console.error('Error:', err));

// Test Position Types
fetch('http://localhost:3011/position-type/public/getall')
  .then(r => r.json())
  .then(data => console.log('Position Types:', data))
  .catch(err => console.error('Error:', err));

// Test Job Groups
fetch('http://localhost:3011/jobgroup/public/getall')
  .then(r => r.json())
  .then(data => console.log('Job Groups:', data))
  .catch(err => console.error('Error:', err));

// Health Check
fetch('http://localhost:3011/api/health')
  .then(r => r.json())
  .then(data => console.log('Health:', data))
  .catch(err => console.error('Error:', err));
```

---

## 📮 Postman Collection

### Import to Postman

1. Create new Collection: "ODPC1 API"
2. Add requests:

#### Request 1: Get Job Titles
```
Name: Get Job Titles
Method: GET
URL: http://localhost:3011/job-title/public/getall
```

#### Request 2: Get Position Levels
```
Name: Get Position Levels
Method: GET
URL: http://localhost:3011/position-level/public/getall
```

#### Request 3: Get Position Types
```
Name: Get Position Types
Method: GET
URL: http://localhost:3011/position-type/public/getall
```

#### Request 4: Get Job Groups
```
Name: Get Job Groups
Method: GET
URL: http://localhost:3011/jobgroup/public/getall
```

#### Request 5: Health Check
```
Name: Health Check
Method: GET
URL: http://localhost:3011/api/health
```

#### Request 6: Server Status
```
Name: Server Status
Method: GET
URL: http://localhost:3011/
```

---

## 🧬 JavaScript/Node.js Testing

### Using Axios
```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:3011';

async function testDropdowns() {
  try {
    console.log('Testing Dropdowns...\n');

    // Test Job Titles
    const jobTitles = await axios.get(`${API_BASE}/job-title/public/getall`);
    console.log('✅ Job Titles:', jobTitles.data);

    // Test Position Levels
    const positionLevels = await axios.get(`${API_BASE}/position-level/public/getall`);
    console.log('✅ Position Levels:', positionLevels.data);

    // Test Position Types
    const positionTypes = await axios.get(`${API_BASE}/position-type/public/getall`);
    console.log('✅ Position Types:', positionTypes.data);

    // Test Job Groups
    const jobGroups = await axios.get(`${API_BASE}/jobgroup/public/getall`);
    console.log('✅ Job Groups:', jobGroups.data);

    // Health Check
    const health = await axios.get(`${API_BASE}/api/health`);
    console.log('✅ Health:', health.data);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDropdowns();
```

### Using Fetch
```javascript
const API_BASE = 'http://localhost:3011';

async function testDropdowns() {
  try {
    console.log('Testing Dropdowns...\n');

    // Test Job Titles
    const jobTitles = await fetch(`${API_BASE}/job-title/public/getall`).then(r => r.json());
    console.log('✅ Job Titles:', jobTitles);

    // Test Position Levels
    const positionLevels = await fetch(`${API_BASE}/position-level/public/getall`).then(r => r.json());
    console.log('✅ Position Levels:', positionLevels);

    // Test Position Types
    const positionTypes = await fetch(`${API_BASE}/position-type/public/getall`).then(r => r.json());
    console.log('✅ Position Types:', positionTypes);

    // Test Job Groups
    const jobGroups = await fetch(`${API_BASE}/jobgroup/public/getall`).then(r => r.json());
    console.log('✅ Job Groups:', jobGroups);

    // Health Check
    const health = await fetch(`${API_BASE}/api/health`).then(r => r.json());
    console.log('✅ Health:', health);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDropdowns();
```

---

## 🧪 Expected Responses

### Job Titles Response
```json
[
  {
    "job_title_id": 1,
    "job_title_name": "ข้าราชการ"
  },
  {
    "job_title_id": 2,
    "job_title_name": "พนักงานสัญญาจ้าง"
  },
  {
    "job_title_id": 3,
    "job_title_name": "ลูกจ้างชั่วคราว"
  }
]
```

### Position Levels Response
```json
[
  {
    "position_level_id": 1,
    "position_level_name": "ระดับ 1"
  },
  {
    "position_level_id": 2,
    "position_level_name": "ระดับ 2"
  },
  {
    "position_level_id": 3,
    "position_level_name": "ระดับ 3"
  },
  {
    "position_level_id": 4,
    "position_level_name": "ระดับ 4"
  },
  {
    "position_level_id": 5,
    "position_level_name": "ระดับ 5"
  }
]
```

### Position Types Response
```json
[
  {
    "position_type_id": 1,
    "position_type_name": "ตำแหน่งบริหาร"
  },
  {
    "position_type_id": 2,
    "position_type_name": "ตำแหน่งวิชาการ"
  },
  {
    "position_type_id": 3,
    "position_type_name": "ตำแหน่งสนับสนุน"
  }
]
```

### Job Groups Response
```json
[
  {
    "job_group_id": 1,
    "job_group_name": "กลุ่มบริหารทั่วไป"
  },
  {
    "job_group_id": 2,
    "job_group_name": "กลุ่มวิชาการ"
  },
  {
    "job_group_id": 3,
    "job_group_name": "กลุ่มเทคนิค"
  },
  {
    "job_group_id": 4,
    "job_group_name": "กลุ่มสนับสนุน"
  }
]
```

### Health Check Response
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2026-05-26T10:30:00.000Z",
  "database": {
    "status": "connected"
  }
}
```

### Server Status Response
```json
{
  "status": "ok",
  "message": "ODPC1 Backend Running",
  "timestamp": "2026-05-26T10:30:00.000Z"
}
```

---

## ✅ Verification Checklist

- [ ] Backend running on port 3011
- [ ] Can access `/job-title/public/getall`
- [ ] Can access `/position-level/public/getall`
- [ ] Can access `/position-type/public/getall`
- [ ] Can access `/jobgroup/public/getall`
- [ ] All responses return JSON arrays
- [ ] Thai text displays correctly
- [ ] No CORS errors in browser console
- [ ] Health check returns "connected" status
- [ ] Server status returns "ok"

---

## 🐛 Troubleshooting

### Issue: "Cannot GET /job-title/public/getall"
**Solution**: 
- Verify backend is running: `npm run dev`
- Check port is 3011
- Verify route exists in `routes/jobTitleRoutes.js`

### Issue: "Empty array returned"
**Solution**:
- Run `npm run seed:mock` to populate data
- Verify data in database: `SELECT * FROM tb_job_title;`

### Issue: "CORS error in browser"
**Solution**:
- Check frontend port is in `.env` ALLOWED_ORIGINS
- Restart backend after changing `.env`

### Issue: "Connection refused"
**Solution**:
- Verify MySQL is running on port 3307
- Check `.env` has correct database URL
- Run `npm run reset:db` to reinitialize

---

## 📊 Performance Testing

### Load Test with Apache Bench
```bash
# Test 100 requests with 10 concurrent
ab -n 100 -c 10 http://localhost:3011/job-title/public/getall
```

### Load Test with wrk
```bash
# Test for 30 seconds with 4 threads
wrk -t4 -c100 -d30s http://localhost:3011/job-title/public/getall
```

---

## 📝 Notes

- All endpoints are public (no authentication required)
- Responses are JSON format
- Thai text uses UTF-8 encoding
- CORS is enabled for localhost:3000
- Database is MySQL on localhost:3307

---

**Last Updated**: May 26, 2026
