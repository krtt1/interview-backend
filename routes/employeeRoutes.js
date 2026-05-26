const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { authenticate, authorize } = require('../middleware/auth');
const uploadExcel = require('../middleware/uploadExcel');
const uploadImage = require('../middleware/uploadImage');

// ================== PUBLIC ROUTES (ไม่ต้อง auth) ==================
// 🔑 Login - Public endpoint
router.post('/login', employeeController.login);

// 👥 Get all employees - Public endpoint (both paths for compatibility)
router.get('/public/all', employeeController.getPublicAll);
router.get('/public/getall', employeeController.getPublicAll);

// 📊 Get employee summary - Public endpoint
router.get('/public/summary', employeeController.getPublicSummary);

// 🔑 Create Test User (สำหรับ testing เท่านั้น - ไม่ต้อง auth)
router.post('/public/create-test-user', async (req, res) => {
  try {
    const bcrypt = require('bcrypt');
    const { Employee } = require('../models');

    console.log('🔑 Creating test user...');

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
    const existing = await Employee.findByPk(testUser.id);
    if (existing) {
      console.log('✅ Test user already exists, updating...');
      await Employee.update(testUser, { where: { id: testUser.id } });
      return res.json({ 
        message: 'Test user updated successfully',
        user: {
          id: testUser.id,
          email: testUser.email,
          name: testUser.first_name_th,
          password: '1234'
        }
      });
    }

    // สร้าง User ใหม่
    console.log('✅ Creating new test user...');
    await Employee.create(testUser);
    res.status(201).json({ 
      message: 'Test user created successfully',
      user: {
        id: testUser.id,
        email: testUser.email,
        name: testUser.first_name_th,
        password: '1234'
      }
    });
  } catch (err) {
    console.error('❌ Error creating test user:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

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

module.exports = router;
