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

module.exports = router;
