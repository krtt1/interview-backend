const express = require('express');
const router = express.Router();
const capacityController = require('../controllers/capacityController');
const { authenticate, authorize } = require('../middleware/auth');
const uploadExcel = require('../middleware/uploadExcel');

// Export ข้อมูลเป็น Excel - admin, superadmin
router.get('/export', authenticate, authorize('admin', 'superadmin'), capacityController.exportExcel);

// Import ข้อมูลจาก Excel - admin, superadmin
router.post('/import', authenticate, authorize('admin', 'superadmin'), uploadExcel.single('file'), capacityController.importExcel);

// ดึงข้อมูลสมรรถนะทั้งหมด - ทุก role
router.get('/', authenticate, capacityController.getAll);

// ดึงข้อมูลสมรรถนะตาม employee_id - ทุก role
router.get('/:id', authenticate, capacityController.getByEmployeeId);

// สร้างหรืออัปเดตข้อมูลสมรรถนะ - admin, superadmin
router.post('/:id', authenticate, authorize('admin', 'superadmin'), capacityController.createOrUpdate);

// ลบข้อมูลสมรรถนะ - admin, superadmin
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), capacityController.delete);

module.exports = router;
