const meetingService = require('../services/meetingService');
const { MeetingEmployee } = require('../models');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const isAdminLevel = (user) =>
  user && ['admin', 'superadmin'].includes(user.role);

// -------------------- GET ALL --------------------
exports.getAll = async (req, res) => {
  try {
    const user = req.user;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isAdminLevel(user)) {
      const result = await meetingService.getAllMeetingsPaged(page, limit);
      return res.json(result);
    }

    const rows = await MeetingEmployee.findAll({
      where: { employee_id: user.id },
      attributes: ['meeting_id']
    });

    const meetingIds = rows.map(r => r.meeting_id);
    const data = await meetingService.getMeetingsByIds(meetingIds);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- GET BY ID --------------------
exports.getById = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const user = req.user;

    await meetingService.updateLateStatus(meetingId);

    if (isAdminLevel(user)) {
      const data = await meetingService.getMeetingById(meetingId);
      if (!data) return res.status(404).json({ message: "Meeting not found" });
      return res.json(data);
    }

    const isParticipant = await meetingService.isUserParticipant(meetingId, user.id);
    if (!isParticipant) {
      return res.status(403).json({ message: "Forbidden: not a participant" });
    }

    const data = await meetingService.getMeetingById(meetingId);
    if (!data) return res.status(404).json({ message: "Meeting not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- GET PARTICIPANTS STATUS (ADMIN) --------------------
exports.getParticipantsStatus = async (req, res) => {
  try {
    const meetingId = req.params.id;

    const data = await meetingService.getMeetingById(meetingId);
    if (!data) {
      return res.status(404).json({ message: 'Meeting not found' });
    }

    const summary = await meetingService.getParticipantsSummary(meetingId);

    res.json({
      meeting: data,
      summary
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- CREATE --------------------
exports.create = async (req, res) => {
  const requestId = Date.now();
  console.log(`\n========== [${requestId}] Meeting Create Request ==========`);
  
  try {
    console.log(`[${requestId}] 📥 Received payload:`, JSON.stringify(req.body, null, 2));
    console.log(`[${requestId}] 👤 User:`, req.user?.id, req.user?.role);
    console.log(`[${requestId}] 🌍 Environment:`, process.env.NODE_ENV);
    
    // Validate required fields
    const { start_date, end_date, topic, meeting_title, organizer, meeting_type, participants } = req.body;
    
    console.log(`[${requestId}] 🔍 Field validation:`, {
      start_date: !!start_date,
      end_date: !!end_date,
      topic: !!topic,
      meeting_title: !!meeting_title,
      organizer: !!organizer,
      meeting_type: !!meeting_type,
      participants_count: Array.isArray(participants) ? participants.length : 0
    });
    
    if (!start_date || !end_date || !topic || !meeting_title || !organizer || !meeting_type) {
      console.error(`[${requestId}] ❌ Missing required fields`);
      return res.status(400).json({ 
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        missing: {
          start_date: !start_date,
          end_date: !end_date,
          topic: !topic,
          meeting_title: !meeting_title,
          organizer: !organizer,
          meeting_type: !meeting_type
        }
      });
    }

    console.log(`[${requestId}] ✅ Validation passed, calling service...`);
    const startTime = Date.now();
    
    const data = await meetingService.createMeeting(req.body);
    
    const duration = Date.now() - startTime;
    console.log(`[${requestId}] ✅ Meeting created successfully in ${duration}ms:`, data.meeting_id);
    console.log(`========== [${requestId}] Request Complete ==========\n`);
    
    res.status(201).json(data);
  } catch (error) {
    const duration = Date.now() - requestId;
    console.error(`[${requestId}] ❌ Meeting Create Error (${duration}ms):`, error.message);
    console.error(`[${requestId}] Error name:`, error.name);
    console.error(`[${requestId}] Stack:`, error.stack);
    
    // Log SQL error if available
    if (error.parent) {
      console.error(`[${requestId}] SQL Error Code:`, error.parent.code);
      console.error(`[${requestId}] SQL Error:`, error.parent.sqlMessage || error.parent.message);
    }
    
    // ส่ง error message ที่เป็นมิตรกับผู้ใช้
    let errorMessage = 'เกิดข้อผิดพลาดในการสร้างการประชุม';
    let statusCode = 500;
    
    if (error.message.includes('Missing required fields')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('Validation Error')) {
      errorMessage = error.message;
      statusCode = 400;
    } else if (error.message.includes('Foreign key')) {
      errorMessage = 'ข้อมูลพนักงานไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
      statusCode = 400;
    } else if (error.message.includes('Duplicate')) {
      errorMessage = 'มีพนักงานซ้ำในรายการ';
      statusCode = 400;
    } else if (error.message.includes('timeout')) {
      errorMessage = 'การสร้างการประชุมใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง';
      statusCode = 504;
    } else if (error.message.includes('connection')) {
      errorMessage = 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้ กรุณาลองใหม่อีกครั้ง';
      statusCode = 503;
    }
    
    console.log(`========== [${requestId}] Request Failed ==========\n`);
    
    res.status(statusCode).json({ 
      error: errorMessage,
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      requestId: requestId
    });
  }
};

// -------------------- UPDATE --------------------
exports.update = async (req, res) => {
  try {
    const data = await meetingService.updateMeeting(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Meeting not found" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- DELETE --------------------
exports.delete = async (req, res) => {
  try {
    const deleted = await meetingService.deleteMeeting(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Meeting not found" });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- ADD PARTICIPANTS --------------------
exports.addParticipants = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const { employee_ids, submit_date } = req.body;

    if (!Array.isArray(employee_ids) || employee_ids.length === 0) {
      return res.status(400).json({ message: 'employee_ids is required' });
    }

    if (!submit_date) {
      return res.status(400).json({ message: 'submit_date is required' });
    }

    const result = await meetingService.addParticipants(
      meetingId,
      employee_ids,
      submit_date
    );

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// -------------------- SUBMIT ATTACHMENT --------------------
exports.submitAttachment = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const employeeId = req.params.employee_id;
    const user = req.user;

    if (!isAdminLevel(user) && user.id !== employeeId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'file is required' });
    }

    const filePath = path.join('uploads', 'meetings', req.file.filename);
    const row = await meetingService.submitAttachment(meetingId, employeeId, filePath);
    await meetingService.updateLateStatus(meetingId);

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DOWNLOAD --------------------
exports.downloadAttachment = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const employeeId = req.params.employee_id;
    const user = req.user;

    if (!(isAdminLevel(user) || user.id === employeeId)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const record = await MeetingEmployee.findOne({
      where: { meeting_id: meetingId, employee_id: employeeId }
    });

    if (!record || !record.attachment_file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = path.join(__dirname, '..', record.attachment_file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File missing on server" });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==================== EXPORT ALL MEETINGS ====================
exports.exportAllMeetingsExcel = async (req, res) => {
  try {
    const meetings = await meetingService.getAllMeetingsForExport();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Meetings');

    sheet.columns = [
      { header: 'Meeting ID', key: 'meeting_id', width: 12 },
      { header: 'หัวข้อ', key: 'meeting_title', width: 40 },
      { header: 'วันที่เริ่ม', key: 'start_date', width: 15 },
      { header: 'วันที่สิ้นสุด', key: 'end_date', width: 15 },
      { header: 'รูปแบบ', key: 'meeting_type', width: 15 },
      { header: 'สถานที่', key: 'location', width: 25 },
      { header: 'ผู้จัด', key: 'organizer', width: 25 },
      { header: 'หมายเหตุ', key: 'note', width: 30 }
    ];

    meetings.forEach(m => sheet.addRow(m.toJSON()));

    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=meetings_all.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ==================== EXPORT ALL MEETING EMPLOYEES (⭐ NEW) ====================
exports.exportAllMeetingEmployeesExcel = async (req, res) => {
  try {
    const rows = await meetingService.getAllMeetingEmployeesForExport();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('MeetingEmployees');

    sheet.columns = [
      { header: 'Meeting ID', key: 'meeting_id', width: 12 },
      { header: 'หัวข้อการประชุม', key: 'meeting_title', width: 40 },
      { header: 'รหัสพนักงาน', key: 'employee_id', width: 15 },
      { header: 'ชื่อ-สกุล', key: 'employee_name', width: 30 },
      { header: 'สถานะ', key: 'tracking_status', width: 18 },
      { header: 'Deadline', key: 'submit_date', width: 15 },
      { header: 'วันที่ส่งจริง', key: 'submitted_at', width: 18 }
    ];

    rows.forEach(r => {
      sheet.addRow({
        meeting_id: r.meeting_id,
        meeting_title: r.meeting?.meeting_title || '',
        employee_id: r.employee_id,
        employee_name: `${r.employee?.first_name_th || ''} ${r.employee?.last_name_th || ''}`,
        tracking_status: r.tracking_status,
        submit_date: r.submit_date,
        submitted_at: r.updated_at
      });
    });

    sheet.getRow(1).font = { bold: true };
    sheet.views = [{ state: 'frozen', ySplit: 1 }];

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=meeting_employees_all.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
