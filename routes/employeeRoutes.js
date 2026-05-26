const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');
const uploadExcel = require('../middleware/uploadExcel');
const uploadImage = require('../middleware/uploadImage');

// PUBLIC ROUTES (ไม่ต้อง authenticate) - ต้องอยู่ก่อน protected routes
router.post('/register', employeeController.register);
router.post('/login', employeeController.login);
router.get('/public/getall', employeeController.getPublicAll);
router.get('/public/summary', employeeController.getPublicSummary);
router.get('/search', employeeController.search);

// Protected - ต้อง login
router.get('/summary', authenticate, employeeController.getSummary);
router.get('/getall', authenticate, authorize('admin'), employeeController.getAll);

// 🔍 Filter by work_status
router.get('/filter/work-status', authenticate, authorize('admin', 'superadmin'), employeeController.filterByWorkStatus);

// 🔍 Filter by job_group - ทุก role ที่ login แล้ว
router.get('/filter/job-group', authenticate, employeeController.filterByJobGroup);

// 📥 Import Excel - เฉพาะ superadmin และ admin
router.post('/import-excel', authenticate, authorize('admin', 'superadmin'), uploadExcel.single('file'), employeeController.importExcel);

// 🔑 Change Password - ทุก role ที่ login แล้ว
router.post('/change-password', authenticate, employeeController.changePassword);

// CRUD operations
router.get('/:id', authenticate, authorize('admin', 'user'), employeeController.getById);
router.put('/:id', authenticate, authorize('admin', 'user', 'superadmin'), uploadImage.single('profile_image'), employeeController.update);
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), employeeController.remove);

// ================== ADMIN ROUTES ==================
// 🔑 Create Test User (สำหรับ testing เท่านั้น)
router.post('/admin/create-test-user', async (req, res) => {
  try {
    // ⚠️ ตรวจสอบ environment (ปิดใน production)
    if (process.env.NODE_ENV === 'production' && process.env.ALLOW_TEST_USER !== 'true') {
      return res.status(403).json({ message: 'This endpoint is disabled in production' });
    }

    const testUser = {
      id: '0123456789123',
      password: '1234',
      email: 'test@example.com',
      prefix_th: 'นาย',
      first_name_th: 'ทดสอบ',
      last_name_th: 'ระบบ',
      gender: 'ชาย',
      birt_date: '1990-01-01',
      age: 34,
      phone_number: '0812345678',
      job_title_id: 1,
      position_level_id: 1,
      position_type_id: 1,
      job_group_id: 1,
      education_level: 'ปริญญาตรี',
      degree_name: 'วิทยาศาสตร์บัณฑิต',
      institution_name: 'มหาวิทยาลัยทดสอบ',
      graduation_year: 2014,
      role: 'user',
      work_status: 'ปฏิบัติหน้าที่'
    };

    // Hash password
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    testUser.password = hashedPassword;

    // ตรวจสอบว่ามี user นี้อยู่แล้วหรือไม่
    const existing = await employeeService.getEmployeeById(testUser.id);
    if (existing) {
      await employeeService.updateEmployee(testUser.id, testUser);
      return res.json({ 
        message: 'Test user updated successfully',
        user: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.first_name_th
        }
      });
    }

    // สร้าง User ใหม่
    await employeeService.createEmployee(testUser);
    res.status(201).json({ 
      message: 'Test user created successfully',
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.first_name_th,
        password: '1234' // แสดง password เพื่อ testing เท่านั้น
      }
    });
  } catch (err) {
    console.error('❌ Error creating test user:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
