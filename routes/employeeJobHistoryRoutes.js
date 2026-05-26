const express = require('express');
const router = express.Router();
const employeeJobHistoryController = require('../controllers/employeeJobHistoryController');
const { authenticate, authorize } = require('../middleware/auth');

// -------------------- 📋 GET JOB HISTORY --------------------

// ดึงประวัติการทำงานทั้งหมด - ทุก role
router.get(
  '/employees/:id/job-history',
  authenticate,
  employeeJobHistoryController.getJobHistory
);

// ดึงตำแหน่งปัจจุบันพร้อมระยะเวลา - ทุก role
router.get(
  '/employees/:id/current-job',
  authenticate,
  employeeJobHistoryController.getCurrentJob
);

// Export ประวัติการทำงานเป็นไฟล์ Excel (รายบุคคล) - Admin only
router.get(
  '/employees/:id/job-history/export',
  authenticate,
  authorize('admin', 'superadmin'),
  employeeJobHistoryController.exportJobHistoryToExcel
);

// ✅ เพิ่ม: เช็คว่ามี job history หรือไม่
router.get(
  '/employees/:id/has-job-history',
  authenticate,
  authorize('admin', 'superadmin'),
  employeeJobHistoryController.checkHasJobHistory
);

// ✅ เพิ่ม: ดึงรายชื่อพนักงานทั้งหมดพร้อมสถานะ job history
router.get(
  '/employees-job-history-status',
  authenticate,
  authorize('admin', 'superadmin'),
  employeeJobHistoryController.getAllEmployeesJobHistoryStatus
);

// -------------------- ✏️ CREATE/UPDATE JOB HISTORY (Admin only) --------------------

// สร้าง job history record แรก (สำหรับ employee เก่า)
router.post(
  '/employees/:id/job-history/initialize',
  authenticate,
  authorize('admin', 'superadmin'),
  employeeJobHistoryController.initializeJobHistory
);

// เปลี่ยนตำแหน่งงาน
router.post(
  '/employees/:id/job-history/change',
  authenticate,
  authorize('admin', 'superadmin'),
  employeeJobHistoryController.changeJobGroup
);

// อัปเดต start_date
router.patch(
  '/job-history/:history_id/start-date',
  authenticate,
  authorize('admin', 'superadmin'),
  employeeJobHistoryController.updateStartDate
);

module.exports = router;
