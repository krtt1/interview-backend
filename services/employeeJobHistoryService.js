const { EmployeeJobHistory, Employee, JobGroup, PositionType, PositionLevel } = require('../models');
const sequelize = require('../config/database');
const { Op } = require('sequelize');

// -------------------- 📋 GET JOB HISTORY --------------------

/**
 * ดึงประวัติการทำงานทั้งหมดของ employee
 */
const getJobHistoryByEmployeeId = async (employeeId) => {
  try {
    return await EmployeeJobHistory.findAll({
      where: { employee_id: employeeId },
      include: [
        { 
          model: JobGroup, 
          as: 'jobGroup',
          attributes: ['job_group_id', 'job_group_name'],
          required: false
        },
        {
          model: PositionType,
          as: 'positionType',
          attributes: ['position_type_id', 'position_type_name'],
          required: false
        },
        {
          model: PositionLevel,
          as: 'positionLevel',
          attributes: ['position_level_id', 'position_level_name'],
          required: false
        }
      ],
      order: [['start_date', 'DESC'], ['created_at', 'DESC']]
    });
  } catch (error) {
    console.error('❌ Error in getJobHistoryByEmployeeId:', error.message);
    console.error('Employee ID:', employeeId);
    throw error;
  }
};

/**
 * ดึงตำแหน่งปัจจุบัน (end_date IS NULL)
 */
const getCurrentJobHistory = async (employeeId) => {
  try {
    return await EmployeeJobHistory.findOne({
      where: { 
        employee_id: employeeId,
        end_date: null
      },
      include: [
        { 
          model: JobGroup, 
          as: 'jobGroup',
          attributes: ['job_group_id', 'job_group_name'],
          required: false
        },
        {
          model: PositionType,
          as: 'positionType',
          attributes: ['position_type_id', 'position_type_name'],
          required: false
        },
        {
          model: PositionLevel,
          as: 'positionLevel',
          attributes: ['position_level_id', 'position_level_name'],
          required: false
        }
      ]
    });
  } catch (error) {
    console.error('❌ Error in getCurrentJobHistory:', error.message);
    console.error('Employee ID:', employeeId);
    throw error;
  }
};

// -------------------- ✏️ CREATE/UPDATE JOB HISTORY --------------------

/**
 * สร้าง job history record แรกสำหรับ employee เก่า (migration)
 * start_date = NULL (รอ admin กำหนดภายหลัง) หรือระบุได้เลย
 */
const createInitialJobHistory = async (employeeId, jobGroupId, startDate = null, positionTypeId = null, positionLevelId = null, transaction = null) => {
  // ตรวจสอบว่ามี active job history อยู่แล้วหรือไม่
  const existing = await EmployeeJobHistory.findOne({
    where: {
      employee_id: employeeId,
      end_date: null
    },
    transaction
  });

  if (existing) {
    throw new Error('Employee มี active job history อยู่แล้ว');
  }

  // Validate start_date ถ้ามีการระบุ
  if (startDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const inputDate = new Date(startDate);
    inputDate.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      throw new Error('start_date ต้องไม่เกินวันปัจจุบัน');
    }
  }

  return EmployeeJobHistory.create({
    employee_id: employeeId,
    job_group_id: jobGroupId,
    position_type_id: positionTypeId,      
    position_level_id: positionLevelId,    
    start_date: startDate,
    end_date: null
  }, { transaction });
};

/**
 * เปลี่ยนตำแหน่งงาน (Change Job Group)
 * - ปิด record เก่าด้วย end_date
 * - สร้าง record ใหม่
 * - start_date ต้องมาจาก admin
 */
const changeJobGroup = async (employeeId, newJobGroupId, startDate, positionTypeId = null, positionLevelId = null) => {
  // Validation
  if (!startDate) {
    throw new Error('กรุณาระบุ start_date สำหรับตำแหน่งใหม่');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(startDate);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    throw new Error('start_date ต้องไม่เกินวันปัจจุบัน');
  }

  // ใช้ transaction เพื่อความปลอดภัย
  const transaction = await sequelize.transaction();

  try {
    // 1. หา active job history
    const currentJob = await EmployeeJobHistory.findOne({
      where: {
        employee_id: employeeId,
        end_date: null
      },
      transaction
    });

    if (!currentJob) {
      throw new Error('ไม่พบตำแหน่งปัจจุบันของ employee');
    }

    // ตรวจสอบว่าเปลี่ยนเป็น job group เดิมหรือไม่
    if (currentJob.job_group_id === newJobGroupId) {
      throw new Error('ไม่สามารถเปลี่ยนเป็น job group เดิมได้');
    }

    // 2. ปิด record เก่า (end_date = วันก่อน start_date ของตำแหน่งใหม่)
    const endDate = new Date(inputDate);
    endDate.setDate(endDate.getDate() - 1);

    await currentJob.update({
      end_date: endDate.toISOString().split('T')[0]
    }, { transaction });

    // 3. สร้าง record ใหม่
    const newJobHistory = await EmployeeJobHistory.create({
    employee_id: employeeId,
    job_group_id: newJobGroupId,
    position_type_id: positionTypeId,      
    position_level_id: positionLevelId,    
    start_date: startDate,
    end_date: null
  }, { transaction });

    // 4. อัปเดต job_group_id ใน tb_employee
    await Employee.update(
      { job_group_id: newJobGroupId },
      { 
        where: { id: employeeId },
        transaction 
      }
    );

    await transaction.commit();
    return newJobHistory;

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * อัปเดต start_date ของตำแหน่งปัจจุบัน (สำหรับ admin กำหนดวันที่ย้อนหลัง)
 */
const updateStartDate = async (historyId, startDate) => {
  if (!startDate) {
    throw new Error('กรุณาระบุ start_date');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(startDate);
  inputDate.setHours(0, 0, 0, 0);

  if (inputDate > today) {
    throw new Error('start_date ต้องไม่เกินวันปัจจุบัน');
  }

  const jobHistory = await EmployeeJobHistory.findByPk(historyId);

  if (!jobHistory) {
    throw new Error('ไม่พบ job history record');
  }

  // ตรวจสอบว่าเป็น active record หรือไม่
  if (jobHistory.end_date !== null) {
    throw new Error('ไม่สามารถแก้ไข start_date ของตำแหน่งที่สิ้นสุดแล้ว');
  }

  await jobHistory.update({ start_date: startDate });
  return jobHistory;
};

// -------------------- 📊 CALCULATE DURATION --------------------

/**
 * คำนวณระยะเวลาการดำรงตำแหน่งปัจจุบัน (real-time)
 * คืนค่าเป็น { years, months, days } หรือ null ถ้า start_date เป็น null
 */
const calculateCurrentJobDuration = async (employeeId) => {
  const currentJob = await getCurrentJobHistory(employeeId);

  if (!currentJob || !currentJob.start_date) {
    return null; // ไม่มีข้อมูลหรือยังไม่ทราบวันเริ่ม
  }

  const startDate = new Date(currentJob.start_date);
  const today = new Date();

  let years = today.getFullYear() - startDate.getFullYear();
  let months = today.getMonth() - startDate.getMonth();
  let days = today.getDate() - startDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years,
    months,
    days,
    start_date: currentJob.start_date,
    job_group: currentJob.jobGroup,
    position_type: currentJob.positionType,
    position_level: currentJob.positionLevel
  };
};

/**
 * ดึงประวัติพร้อมคำนวณระยะเวลาแต่ละตำแหน่ง
 */
const getJobHistoryWithDuration = async (employeeId) => {
  const history = await getJobHistoryByEmployeeId(employeeId);

  return history.map(record => {
    let duration = null;

    if (record.start_date) {
      const startDate = new Date(record.start_date);
      const endDate = record.end_date ? new Date(record.end_date) : new Date();

      let years = endDate.getFullYear() - startDate.getFullYear();
      let months = endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();

      if (days < 0) {
        months--;
        const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
        days += lastMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      duration = { years, months, days };
    }

    return {
      history_id: record.history_id,
      employee_id: record.employee_id,
      job_group_id: record.job_group_id,
      job_group: record.jobGroup,
      position_type: record.positionType,
      position_level: record.positionLevel,
      start_date: record.start_date,
      end_date: record.end_date,
      is_current: record.end_date === null,
      duration,
      created_at: record.created_at,
      updated_at: record.updated_at
    };
  });
};

// -------------------- 📥 EXPORT TO EXCEL --------------------

/**
 * Export ประวัติการทำงานของพนักงานคนเดียวเป็นไฟล์ Excel
 */
const exportEmployeeJobHistoryToExcel = async (employeeId) => {
  const ExcelJS = require('exceljs');
  
  // ดึงข้อมูลพนักงาน
  const employee = await Employee.findByPk(employeeId, {
    include: [
      { 
        model: JobGroup, 
        as: 'jobGroup',
        attributes: ['job_group_name']
      }
    ]
  });

  if (!employee) {
    throw new Error('ไม่พบข้อมูลพนักงาน');
  }

  // ดึงประวัติการทำงานพร้อมคำนวณระยะเวลา
  const history = await getJobHistoryWithDuration(employeeId);

  if (history.length === 0) {
    throw new Error('ไม่มีข้อมูลประวัติการทำงาน');
  }

  // สร้าง workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('ประวัติการทำงาน');

  // ตั้งค่าความกว้างคอลัมน์
  worksheet.columns = [
    { key: 'no', width: 8 },
    { key: 'job_group', width: 30 },
    { key: 'position_type', width: 20 },
    { key: 'position_level', width: 20 },
    { key: 'start_date', width: 15 },
    { key: 'end_date', width: 15 },
    { key: 'duration', width: 25 },
    { key: 'status', width: 15 }
  ];

  // หัวข้อข้อมูลพนักงาน
  worksheet.mergeCells('A1:H1');
  const titleRow = worksheet.getCell('A1');
  titleRow.value = 'ประวัติการทำงาน';
  titleRow.font = { size: 16, bold: true };
  titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
  titleRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  titleRow.font = { ...titleRow.font, color: { argb: 'FFFFFFFF' } };

  // ข้อมูลพนักงาน
  worksheet.addRow([]);
  worksheet.addRow(['รหัสพนักงาน:', employee.id]);
  worksheet.addRow(['ชื่อ-นามสกุล:', `${employee.prefix_th}${employee.first_name_th} ${employee.last_name_th}`]);
  worksheet.addRow(['ตำแหน่งปัจจุบัน:', employee.jobGroup ? employee.jobGroup.job_group_name : '-']);
  worksheet.addRow([]);

  // หัวตาราง
  const headerRow = worksheet.addRow([
    'ลำดับ',
    'ตำแหน่ง',
    'ประเภทตำแหน่ง',
    'ระดับตำแหน่ง',
    'วันที่เริ่มต้น',
    'วันที่สิ้นสุด',
    'ระยะเวลา',
    'สถานะ'
  ]);

  // จัดรูปแบบหัวตาราง
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF70AD47' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // เพิ่มข้อมูลแต่ละแถว
  history.forEach((record, index) => {
    const durationText = record.duration 
      ? `${record.duration.years} ปี ${record.duration.months} เดือน ${record.duration.days} วัน`
      : '-';

    const row = worksheet.addRow([
      index + 1,
      record.job_group ? record.job_group.job_group_name : '-',
      record.position_type ? record.position_type.position_type_name : '-',
      record.position_level ? record.position_level.position_level_name : '-',
      record.start_date || '-',
      record.end_date || '-',
      durationText,
      record.is_current ? 'ปัจจุบัน' : 'สิ้นสุดแล้ว'
    ]);

    // จัดรูปแบบแถวข้อมูล
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.alignment = { vertical: 'middle' };
    });

    // ไฮไลท์ตำแหน่งปัจจุบัน
    if (record.is_current) {
      row.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFF2CC' }
        };
      });
    }
  });

  // เพิ่มหมายเหตุ
  worksheet.addRow([]);
  const noteRow = worksheet.addRow(['หมายเหตุ: แถวที่ไฮไลท์สีเหลืองคือตำแหน่งปัจจุบัน']);
  noteRow.getCell(1).font = { italic: true, size: 10 };

  return workbook;
};

module.exports = {
  getJobHistoryByEmployeeId,
  getCurrentJobHistory,
  createInitialJobHistory,
  changeJobGroup,
  updateStartDate,
  calculateCurrentJobDuration,
  getJobHistoryWithDuration,
  exportEmployeeJobHistoryToExcel
};
