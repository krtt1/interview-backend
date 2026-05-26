const employeeJobHistoryService = require('../services/employeeJobHistoryService');

// -------------------- 📋 GET JOB HISTORY --------------------

/**
 * ดึงประวัติการทำงานทั้งหมดของ employee พร้อมคำนวณระยะเวลา
 * GET /employees/:id/job-history
 */
const getJobHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await employeeJobHistoryService.getJobHistoryWithDuration(id);

    res.json({
      employee_id: id,
      total_records: history.length,
      data: history
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ดึงตำแหน่งปัจจุบันพร้อมระยะเวลา
 * GET /employees/:id/current-job
 */
const getCurrentJob = async (req, res) => {
  try {
    const { id } = req.params;
    const duration = await employeeJobHistoryService.calculateCurrentJobDuration(id);

    if (!duration) {
      return res.json({
        employee_id: id,
        message: 'ไม่มีข้อมูลตำแหน่งปัจจุบัน หรือยังไม่ได้กำหนด start_date',
        current_job: null,
        duration: null
      });
    }

    res.json({
      employee_id: id,
      current_job: {
        job_group: duration.job_group,
        position_type: duration.position_type,
        position_level: duration.position_level
      },
      start_date: duration.start_date,
      duration: {
        years: duration.years,
        months: duration.months,
        days: duration.days,
        display: `${duration.years} ปี ${duration.months} เดือน ${duration.days} วัน`
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- ✏️ CREATE/UPDATE JOB HISTORY --------------------

/**
 * สร้าง job history record แรก (สำหรับ employee เก่า)
 * POST /employees/:id/job-history/initialize
 * Body: { job_group_id, start_date? }
 */
const initializeJobHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { job_group_id, start_date, position_type_id, position_level_id } = req.body;

    if (!job_group_id) {
      return res.status(400).json({ message: 'กรุณาระบุ job_group_id' });
    }

    const jobHistory = await employeeJobHistoryService.createInitialJobHistory(
      id, 
      job_group_id, 
      start_date || null,
      position_type_id || null,    
      position_level_id || null     
    );

    res.status(201).json({
      message: start_date 
        ? 'สร้าง job history สำเร็จ' 
        : 'สร้าง job history สำเร็จ (start_date = NULL, รอ admin กำหนด)',
      data: jobHistory
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * เปลี่ยนตำแหน่งงาน
 * POST /employees/:id/job-history/change
 * Body: { new_job_group_id, start_date }
 */
const changeJobGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { new_job_group_id, start_date, position_type_id, position_level_id } = req.body;

    if (!new_job_group_id) {
      return res.status(400).json({ message: 'กรุณาระบุ new_job_group_id' });
    }

    if (!start_date) {
      return res.status(400).json({ message: 'กรุณาระบุ start_date (YYYY-MM-DD)' });
    }

    const newJobHistory = await employeeJobHistoryService.changeJobGroup(
      id, 
      new_job_group_id, 
      start_date,
      position_type_id || null,    
      position_level_id || null,    
    );

    res.json({
      message: 'เปลี่ยนตำแหน่งสำเร็จ',
      data: newJobHistory
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * อัปเดต start_date ของตำแหน่งปัจจุบัน
 * PATCH /job-history/:history_id/start-date
 * Body: { start_date }
 */
const updateStartDate = async (req, res) => {
  try {
    const { history_id } = req.params;
    const { start_date } = req.body;

    if (!start_date) {
      return res.status(400).json({ message: 'กรุณาระบุ start_date (YYYY-MM-DD)' });
    }

    const updated = await employeeJobHistoryService.updateStartDate(history_id, start_date);

    res.json({
      message: 'อัปเดต start_date สำเร็จ',
      data: updated
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * เช็คว่า employee มี job history หรือไม่
 * GET /employees/:id/has-job-history
 */
const checkHasJobHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const history = await employeeJobHistoryService.getJobHistoryByEmployeeId(id);

    res.json({
      employee_id: id,
      has_job_history: history.length > 0,
      total_records: history.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ดึงรายชื่อพนักงานทั้งหมดพร้อมสถานะ job history
 * GET /employees-job-history-status
 */
const getAllEmployeesJobHistoryStatus = async (req, res) => {
  try {
    const { Employee, EmployeeJobHistory } = require('../models');
    
    const employees = await Employee.findAll({
      attributes: ['id', 'prefix_th', 'first_name_th', 'last_name_th', 'job_group_id'],
      include: [{
        model: EmployeeJobHistory,
        as: 'jobHistory',
        attributes: ['history_id'],
        required: false
      }]
    });

    const result = employees.map(emp => ({
      id: emp.id,
      name: `${emp.prefix_th}${emp.first_name_th} ${emp.last_name_th}`,
      job_group_id: emp.job_group_id,
      has_job_history: emp.jobHistory && emp.jobHistory.length > 0
    }));

    res.json({
      total: result.length,
      data: result
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- 📥 EXPORT TO EXCEL --------------------

/**
 * Export ประวัติการทำงานของพนักงานคนเดียวเป็นไฟล์ Excel
 * GET /employees/:id/job-history/export
 */
const exportJobHistoryToExcel = async (req, res) => {
  try {
    const { id } = req.params;

    // สร้างไฟล์ Excel
    const workbook = await employeeJobHistoryService.exportEmployeeJobHistoryToExcel(id);

    // ตั้งค่า response headers
    const { Employee } = require('../models');
    const employee = await Employee.findByPk(id);
    const fileName = `JobHistory_${employee.id}_${employee.first_name_th}_${Date.now()}.xlsx`;

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

    // ส่งไฟล์
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  getJobHistory,
  getCurrentJob,
  checkHasJobHistory,
  getAllEmployeesJobHistoryStatus,
  initializeJobHistory,
  changeJobGroup,
  updateStartDate,
  exportJobHistoryToExcel
};
