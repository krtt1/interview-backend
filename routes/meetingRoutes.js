const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// สร้าง meeting (ทั้ง admin และ user สร้างได้)
router.post('/create', authenticate, authorize('admin'), meetingController.create);

// เพิ่มผู้เข้าอบรมหลายคน
router.post('/:id/participants', authenticate, authorize('admin', 'superadmin'), meetingController.addParticipants);

// Participant (or admin on behalf) ส่งไฟล์สำหรับ employee
// ใช้ multipart/form-data field name: 'file'
router.post('/:id/submit/:employee_id', authenticate, upload.single('file'), meetingController.submitAttachment);

// export all meeting ค้าบสุดหล่อ
router.get('/export-excel', authenticate, authorize('admin', 'superadmin'), meetingController.exportAllMeetingsExcel);

// export all meeting-employee พร้อมก่อ
router.get('/export-meeting-employees', authenticate, authorize('admin', 'superadmin'), meetingController.exportAllMeetingEmployeesExcel);

// ดึง meeting ทั้งหมด
router.get('/getall', authenticate, meetingController.getAll);

// ดึง meeting ตาม id
router.get('/:id', authenticate, meetingController.getById);

// ดูสถานะ participants (admin only)
router.get('/:id/participants', authenticate, authorize('admin'), meetingController.getParticipantsStatus);

// ดาวน์โหลดไฟล์ของ employee ใน meeting (admin หรือ owner)
router.get('/:id/download/:employee_id', authenticate, meetingController.downloadAttachment);

// อัปเดต meeting (admin)
router.put('/:id', authenticate, authorize('admin'), meetingController.update);

// ลบ meeting (admin)
router.delete('/:id', authenticate, authorize('admin'), meetingController.delete);

module.exports = router;
