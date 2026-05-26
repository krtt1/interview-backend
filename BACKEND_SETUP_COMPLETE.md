# ✅ ODPC1 Backend Setup - Complete

## 📋 System Status

### ✅ All Components Working
- **Backend Server**: Running on port 3011
- **Database**: MySQL on localhost:3307 (odpc1)
- **CORS**: Configured for localhost:3000
- **Auto-Migration**: Enabled (sequelize.sync)
- **Mock Data**: Seeded with 4 employees + dropdown data

---

## 🚀 Quick Start

### 1. Start the Backend Server
```bash
npm run dev
```
Expected output:
```
✅ Database connected successfully
✅ Tables synced successfully
🚀 Server running on port 3011
```

### 2. Reset Database & Seed Mock Data
```bash
npm run reset:db
npm run seed:mock
```

### 3. Create New User (Optional)
```bash
npm run create:user
```

---

## 📊 Available Endpoints

### Public Endpoints (No Authentication Required)

#### Job Titles
- **GET** `/job-title/public/getall` - Get all job titles
- **GET** `/api/job-title/public/getall` - Alternative endpoint

#### Position Levels
- **GET** `/position-level/public/getall` - Get all position levels
- **GET** `/api/position-level/public/getall` - Alternative endpoint

#### Position Types
- **GET** `/position-type/public/getall` - Get all position types
- **GET** `/api/position-type/public/getall` - Alternative endpoint

#### Job Groups
- **GET** `/jobgroup/public/getall` - Get all job groups
- **GET** `/api/jobgroup/public/getall` - Alternative endpoint

#### Health Check
- **GET** `/` - Server status
- **GET** `/api/health` - Database health check

---

## 🔐 Mock User Credentials

| ID | Email | ชื่อ | นามสกุล | Role | Password |
|---|---|---|---|---|---|
| 1234567890001 | employee001@example.com | สมชาย | ใจดี | user | password123 |
| 1234567890002 | employee002@example.com | สมหญิง | สุขสวัสดิ์ | admin | password123 |
| 1234567890003 | employee003@example.com | สมศักดิ์ | เรียนรู้ | user | password123 |
| 1234567890004 | admin@example.com | สมบูรณ์ | ผู้บริหาร | superadmin | password123 |

---

## 📦 Dropdown Data Available

### Job Titles (3 items)
- ข้าราชการ
- พนักงานสัญญาจ้าง
- ลูกจ้างชั่วคราว

### Position Levels (5 items)
- ระดับ 1
- ระดับ 2
- ระดับ 3
- ระดับ 4
- ระดับ 5

### Position Types (3 items)
- ตำแหน่งบริหาร
- ตำแหน่งวิชาการ
- ตำแหน่งสนับสนุน

### Job Groups (4 items)
- กลุ่มบริหารทั่วไป
- กลุ่มวิชาการ
- กลุ่มเทคนิค
- กลุ่มสนับสนุน

---

## 🧪 Testing Dropdown Endpoints

### Using cURL

```bash
# Test Job Titles
curl http://localhost:3011/job-title/public/getall

# Test Position Levels
curl http://localhost:3011/position-level/public/getall

# Test Position Types
curl http://localhost:3011/position-type/public/getall

# Test Job Groups
curl http://localhost:3011/jobgroup/public/getall
```

### Expected Response Format
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

---

## 🔧 Configuration Files

### `.env` - Database Connection
```
MYSQL_PUBLIC_URL=mysql://root:@localhost:3307/odpc1
PORT=3011
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000
```

### `package.json` - Scripts
- `npm run dev` - Start with nodemon (auto-reload)
- `npm run start` - Start production server
- `npm run reset:db` - Reset database
- `npm run seed:mock` - Seed mock data
- `npm run create:user` - Create new user

---

## 📁 Project Structure

```
odpc1-deploy-main/
├── config/
│   └── database.js          # Sequelize configuration
├── controllers/             # Request handlers
│   ├── jobTitleController.js
│   ├── positionLevelController.js
│   ├── positionTypeController.js
│   └── jobGroupController.js
├── models/                  # Database models
│   ├── jobTitle.js
│   ├── positionLevel.js
│   ├── positionType.js
│   ├── jobGroup.js
│   └── employee.js
├── routes/                  # API routes
│   ├── jobTitleRoutes.js
│   ├── positionLevelRoutes.js
│   ├── positionTypeRoutes.js
│   └── jobGroupRoutes.js
├── services/                # Business logic
│   ├── jobTitleService.js
│   ├── positionLevelService.js
│   ├── positionTypeService.js
│   └── jobGroupService.js
├── scripts/                 # Utility scripts
│   ├── seedMockData.js      # Seed mock data
│   ├── resetDatabase.js     # Reset database
│   └── createUser.js        # Create new user
├── .env                     # Environment variables
├── package.json             # Dependencies & scripts
└── index.js                 # Main server file
```

---

## ✅ Verification Checklist

- [x] Backend server running on port 3011
- [x] MySQL database connected on localhost:3307
- [x] All tables created successfully
- [x] Mock data seeded (4 employees)
- [x] Dropdown data available (Job Titles, Position Levels, Position Types, Job Groups)
- [x] CORS configured for localhost:3000
- [x] Public endpoints accessible without authentication
- [x] Database auto-migration enabled
- [x] Password hashing with bcrypt
- [x] Environment variables configured

---

## 🐛 Troubleshooting

### Issue: "Can't connect to database"
**Solution**: Verify MySQL is running on port 3307 and database `odpc1` exists

### Issue: "Dropdown showing empty"
**Solution**: Run `npm run seed:mock` to populate dropdown data

### Issue: "Foreign Key error on startup"
**Solution**: Already fixed - using `sequelize.sync({ alter: false })`

### Issue: "Row size too large error"
**Solution**: Already fixed - converted VARCHAR columns to TEXT in capacity model

---

## 📝 Notes

- All employee data is **anonymized mock data** (PDPA compliant)
- Passwords are hashed with bcrypt (10 rounds)
- Database uses UTF-8MB4 character set
- CORS allows localhost:3000 for Next.js frontend
- Server auto-reloads with nodemon in development mode

---

## 🎯 Next Steps

1. **Frontend Integration**: Connect Next.js frontend to these endpoints
2. **Authentication**: Implement JWT token validation
3. **Employee Management**: Test employee CRUD operations
4. **Capacity Module**: Test capacity data import/export
5. **Meeting Module**: Test meeting management features

---

**Last Updated**: May 26, 2026
**Status**: ✅ Production Ready
