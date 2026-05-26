# 🎨 Frontend Integration Guide

## 📡 API Base URL

```
http://localhost:3011
```

---

## 🔗 Dropdown Endpoints (No Auth Required)

### 1. Job Titles
```
GET http://localhost:3011/job-title/public/getall
```

**Response:**
```json
[
  { "job_title_id": 1, "job_title_name": "ข้าราชการ" },
  { "job_title_id": 2, "job_title_name": "พนักงานสัญญาจ้าง" },
  { "job_title_id": 3, "job_title_name": "ลูกจ้างชั่วคราว" }
]
```

### 2. Position Levels
```
GET http://localhost:3011/position-level/public/getall
```

**Response:**
```json
[
  { "position_level_id": 1, "position_level_name": "ระดับ 1" },
  { "position_level_id": 2, "position_level_name": "ระดับ 2" },
  { "position_level_id": 3, "position_level_name": "ระดับ 3" },
  { "position_level_id": 4, "position_level_name": "ระดับ 4" },
  { "position_level_id": 5, "position_level_name": "ระดับ 5" }
]
```

### 3. Position Types
```
GET http://localhost:3011/position-type/public/getall
```

**Response:**
```json
[
  { "position_type_id": 1, "position_type_name": "ตำแหน่งบริหาร" },
  { "position_type_id": 2, "position_type_name": "ตำแหน่งวิชาการ" },
  { "position_type_id": 3, "position_type_name": "ตำแหน่งสนับสนุน" }
]
```

### 4. Job Groups
```
GET http://localhost:3011/jobgroup/public/getall
```

**Response:**
```json
[
  { "job_group_id": 1, "job_group_name": "กลุ่มบริหารทั่วไป" },
  { "job_group_id": 2, "job_group_name": "กลุ่มวิชาการ" },
  { "job_group_id": 3, "job_group_name": "กลุ่มเทคนิค" },
  { "job_group_id": 4, "job_group_name": "กลุ่มสนับสนุน" }
]
```

---

## 💻 React/Next.js Example

### Fetch Dropdown Data
```javascript
// hooks/useDropdowns.js
import { useState, useEffect } from 'react';

export const useDropdowns = () => {
  const [jobTitles, setJobTitles] = useState([]);
  const [positionLevels, setPositionLevels] = useState([]);
  const [positionTypes, setPositionTypes] = useState([]);
  const [jobGroups, setJobGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [titles, levels, types, groups] = await Promise.all([
          fetch('http://localhost:3011/job-title/public/getall').then(r => r.json()),
          fetch('http://localhost:3011/position-level/public/getall').then(r => r.json()),
          fetch('http://localhost:3011/position-type/public/getall').then(r => r.json()),
          fetch('http://localhost:3011/jobgroup/public/getall').then(r => r.json())
        ]);

        setJobTitles(titles);
        setPositionLevels(levels);
        setPositionTypes(types);
        setJobGroups(groups);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDropdowns();
  }, []);

  return { jobTitles, positionLevels, positionTypes, jobGroups, loading, error };
};
```

### Use in Component
```javascript
// components/EmployeeForm.jsx
import { useDropdowns } from '@/hooks/useDropdowns';

export default function EmployeeForm() {
  const { jobTitles, positionLevels, positionTypes, jobGroups, loading } = useDropdowns();

  if (loading) return <div>Loading...</div>;

  return (
    <form>
      <select name="job_title_id">
        <option value="">-- เลือกตำแหน่ง --</option>
        {jobTitles.map(title => (
          <option key={title.job_title_id} value={title.job_title_id}>
            {title.job_title_name}
          </option>
        ))}
      </select>

      <select name="position_level_id">
        <option value="">-- เลือกระดับตำแหน่ง --</option>
        {positionLevels.map(level => (
          <option key={level.position_level_id} value={level.position_level_id}>
            {level.position_level_name}
          </option>
        ))}
      </select>

      <select name="position_type_id">
        <option value="">-- เลือกประเภทบุคลากร --</option>
        {positionTypes.map(type => (
          <option key={type.position_type_id} value={type.position_type_id}>
            {type.position_type_name}
          </option>
        ))}
      </select>

      <select name="job_group_id">
        <option value="">-- เลือกกลุ่มงาน --</option>
        {jobGroups.map(group => (
          <option key={group.job_group_id} value={group.job_group_id}>
            {group.job_group_name}
          </option>
        ))}
      </select>
    </form>
  );
}
```

---

## 🧪 Testing with Postman

### 1. Create New Request
- Method: `GET`
- URL: `http://localhost:3011/job-title/public/getall`

### 2. Send Request
- Click "Send"
- Should see array of job titles

### 3. Repeat for Other Endpoints
- `/position-level/public/getall`
- `/position-type/public/getall`
- `/jobgroup/public/getall`

---

## 🔄 CORS Configuration

Backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://127.0.0.1:3000`

If frontend is on different port, update `.env`:
```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:YOUR_PORT
```

Then restart backend: `npm run dev`

---

## 📝 Field Mapping

When sending data to backend, use these field names:

### Job Title
- `job_title_id` (number)
- `job_title_name` (string)

### Position Level
- `position_level_id` (number)
- `position_level_name` (string)

### Position Type
- `position_type_id` (number)
- `position_type_name` (string)

### Job Group
- `job_group_id` (number)
- `job_group_name` (string)

---

## ✅ Verification Steps

1. **Start Backend**
   ```bash
   npm run dev
   ```

2. **Test Endpoint in Browser**
   ```
   http://localhost:3011/job-title/public/getall
   ```
   Should see JSON array

3. **Test in Frontend**
   - Open browser DevTools (F12)
   - Check Network tab
   - Verify requests to `http://localhost:3011/*`
   - Check for CORS errors

4. **Verify Dropdown Display**
   - Dropdowns should show all options
   - No empty values
   - Thai text displays correctly

---

## 🐛 Common Issues

### Issue: "CORS error"
**Solution**: Ensure backend is running and frontend port is in ALLOWED_ORIGINS

### Issue: "Dropdown empty"
**Solution**: 
1. Check Network tab - verify API returns data
2. Run `npm run seed:mock` on backend
3. Restart backend

### Issue: "Thai text shows as ???"
**Solution**: Ensure database uses UTF-8MB4 charset (already configured)

---

## 📞 Support

Backend running on: `http://localhost:3011`
Health check: `http://localhost:3011/api/health`

If issues, check:
1. Backend is running (`npm run dev`)
2. MySQL is running on port 3307
3. Mock data is seeded (`npm run seed:mock`)
4. Frontend port is in ALLOWED_ORIGINS

---

**Last Updated**: May 26, 2026
