const { Employee, JobTitle, PositionLevel, PositionType, JobGroup } = require('../models');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');

const saltRounds = 10;

// -------------------- CREATE --------------------
const createEmployee = async (data) => {
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);
  data.password = hashedPassword;
  return Employee.create(data);
};

// -------------------- CRUD --------------------
const getAllEmployees = () => Employee.findAll({
  include: [
    { model: JobTitle, as: 'jobTitle', attributes: ['job_title_id', 'job_title_name'] },
    { model: PositionLevel, as: 'positionLevel', attributes: ['position_level_id', 'position_level_name'] },
    { model: PositionType, as: 'positionType', attributes: ['position_type_id', 'position_type_name'] },
    { model: JobGroup, as: 'jobGroup', attributes: ['job_group_id', 'job_group_name'] }
  ]
});

const getEmployeeById = (id) => Employee.findByPk(id);

const updateEmployee = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, saltRounds);
  }
  return Employee.update(data, { where: { id } });
};

const deleteEmployee = (id) => Employee.destroy({ where: { id } });

// -------------------- 🔍 SEARCH --------------------
const searchEmployeesByFirstName = async (keyword) => {
  if (!keyword) return [];

  return Employee.findAll({
    where: {
      [Op.or]: [
        { first_name_th: { [Op.like]: `%${keyword}%` } },
        { last_name_th: { [Op.like]: `%${keyword}%` } }
      ]
    },
    attributes: ['id', 'prefix_th', 'first_name_th', 'last_name_th', 'job_title_id', 'job_group_id'],
    include: [
      { model: JobTitle, as: 'jobTitle', attributes: ['job_title_id', 'job_title_name'] },
      { model: PositionLevel, as: 'positionLevel', attributes: ['position_level_id', 'position_level_name'] },
      { model: PositionType, as: 'positionType', attributes: ['position_type_id', 'position_type_name'] },
      { model: JobGroup, as: 'jobGroup', attributes: ['job_group_id', 'job_group_name'] }
    ],
    limit: 10,
    order: [['first_name_th', 'ASC']]
  });
};

// -------------------- 📊 SUMMARY --------------------
const getEmployeeSummary = async () => {
  const employees = await Employee.findAll({
    attributes: ['gender', 'age']
  });

  const summary = {
    total: employees.length,
    gender: {
      ชาย: 0,
      หญิง: 0
    },
    generation: {
      'Gen Z (< 27)': 0,
      'Gen Y (27-42)': 0,
      'Gen X (43-58)': 0,
      'Boomer (59+)': 0
    }
  };

  for (const emp of employees) {
    if (emp.gender === 'ชาย') summary.gender.ชาย++;
    if (emp.gender === 'หญิง') summary.gender.หญิง++;

    const age = emp.age;
    if (age == null) continue;

    if (age < 27) summary.generation['Gen Z (< 27)']++;
    else if (age <= 42) summary.generation['Gen Y (27-42)']++;
    else if (age <= 58) summary.generation['Gen X (43-58)']++;
    else summary.generation['Boomer (59+)']++;
  }

  return summary;
};

// -------------------- 🔍 FILTER BY WORK STATUS --------------------
const getEmployeesByWorkStatus = async (workStatus) => {
  const validStatuses = ['ปฏิบัติหน้าที่', 'หมดสัญญา', 'โอนย้าย', 'ลาออก', 'เสียชีวิต'];
  
  if (!validStatuses.includes(workStatus)) {
    throw new Error(`work_status ไม่ถูกต้อง (ต้องเป็น: ${validStatuses.join(', ')})`);
  }

  return Employee.findAll({
    where: { work_status: workStatus },
    attributes: { exclude: ['password'] },
    include: [
      { model: JobTitle, as: 'jobTitle' },
      { model: PositionLevel, as: 'positionLevel' },
      { model: PositionType, as: 'positionType' },
      { model: JobGroup, as: 'jobGroup' }
    ],
    order: [['first_name_th', 'ASC']]
  });
};

// -------------------- 🔍 FILTER BY JOB GROUP --------------------
const getEmployeesByJobGroup = async (jobGroupId) => {
  if (!jobGroupId) {
    throw new Error('กรุณาระบุ job_group_id');
  }

  return Employee.findAll({
    where: { job_group_id: jobGroupId },
    attributes: { exclude: ['password'] },
    include: [
      { model: JobTitle, as: 'jobTitle' },
      { model: PositionLevel, as: 'positionLevel' },
      { model: PositionType, as: 'positionType' },
      { model: JobGroup, as: 'jobGroup' }
    ],
    order: [['first_name_th', 'ASC']]
  });
};

// -------------------- 🔑 CHANGE PASSWORD --------------------
const changePassword = async (userId, oldPassword, newPassword) => {
  // ดึงข้อมูล employee
  const employee = await Employee.findByPk(userId);
  if (!employee) {
    throw new Error('ไม่พบผู้ใช้งาน');
  }

  // ตรวจสอบรหัสผ่านเก่า
  const isMatch = await bcrypt.compare(oldPassword, employee.password);
  if (!isMatch) {
    throw new Error('รหัสผ่านเก่าไม่ถูกต้อง');
  }

  // ตรวจสอบว่ารหัสผ่านใหม่ต้องไม่เหมือนเก่า
  const isSameAsOld = await bcrypt.compare(newPassword, employee.password);
  if (isSameAsOld) {
    throw new Error('รหัสผ่านใหม่ต้องไม่เหมือนรหัสผ่านเก่า');
  }

  // Hash รหัสผ่านใหม่
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Update password
  await Employee.update(
    { password: hashedPassword },
    { where: { id: userId } }
  );

  return true;
};
// -------------------- 📥 IMPORT FROM EXCEL --------------------
const importEmployeesFromExcel = async (filePath) => {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const worksheet = workbook.getWorksheet(1);
  if (!worksheet) {
    throw new Error('ไม่พบ worksheet ในไฟล์ Excel');
  }

  const results = {
    success: 0,
    failed: 0,
    errors: []
  };

  // อ่าน header จาก row แรก
  const headerRow = worksheet.getRow(1);
  const headers = [];
  headerRow.eachCell((cell, colNumber) => {
    headers[colNumber] = cell.value?.toString().trim();
  });

  // Map header names to model fields (รองรับทั้ง exact match และ lowercase)
  const fieldMapping = {
    // Exact match (ตาม Excel ของคุณ)
    'id': 'id',
    'password': 'password',
    'email': 'email',
    'prefix_th': 'prefix_th',
    'first_name_th': 'first_name_th',
    'last_name_th': 'last_name_th',
    'gender': 'gender',
    'birt_date': 'birt_date',
    'age': 'age',
    'phone_number': 'phone_number',
    'job_title_id': 'job_title_id',
    'position_level_id': 'position_level_id',
    'position_type_id': 'position_type_id',
    'job_group_id': 'job_group_id',
    'education_level': 'education_level',
    'degree_name': 'degree_name',
    'institution_name': 'institution_name',
    'graduation_year': 'graduation_year',
    'degree_for_employment': 'degree_for_employment',
    'highest_degree': 'highest_degree',
    'professional_license_degree': 'professional_license_degree',
    'role': 'role',
    // Thai alternatives
    'รหัสพนักงาน': 'id',
    'รหัสผ่าน': 'password',
    'อีเมล': 'email',
    'คำนำหน้า': 'prefix_th',
    'ชื่อ': 'first_name_th',
    'นามสกุล': 'last_name_th',
    'เพศ': 'gender',
    'วันเกิด': 'birt_date',
    'อายุ': 'age',
    'เบอร์โทร': 'phone_number',
    'ระดับการศึกษา': 'education_level',
    'วุฒิการศึกษา': 'degree_name',
    'สถาบันการศึกษา': 'institution_name',
    'ปีที่สำเร็จการศึกษา': 'graduation_year',
    'วุฒิที่ใช้บรรจุ': 'degree_for_employment',
    'วุฒิสูงสุด': 'highest_degree',
    'วุฒิใบประกอบวิชาชีพ': 'professional_license_degree'
  };

  // สร้าง column index mapping
  const columnMap = {};
  headers.forEach((header, index) => {
    if (header && fieldMapping[header]) {
      columnMap[fieldMapping[header]] = index;
    }
  });

  // ตรวจสอบว่ามี column ที่จำเป็น
  if (!columnMap.id) {
    throw new Error('ไม่พบคอลัมน์ id หรือ รหัสพนักงาน ในไฟล์ Excel');
  }

  // อ่านข้อมูลจาก row ที่ 2 เป็นต้นไป
  for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
    const row = worksheet.getRow(rowNumber);
    
    try {
      const employeeData = {};
      
      // อ่านค่าจากแต่ละ column
      Object.entries(columnMap).forEach(([field, colIndex]) => {
        const cellValue = row.getCell(colIndex).value;
        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
          // จัดการกับ Date object
          if (field === 'birt_date') {
            if (cellValue instanceof Date) {
              employeeData[field] = cellValue.toISOString().split('T')[0];
            } else {
              // รองรับ format YYYY-MM-DD หรือ DD/MM/YYYY
              const dateStr = cellValue.toString().trim();
              if (dateStr.includes('/')) {
                const parts = dateStr.split('/');
                if (parts.length === 3) {
                  // DD/MM/YYYY -> YYYY-MM-DD
                  employeeData[field] = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
                }
              } else {
                employeeData[field] = dateStr;
              }
            }
          } else if (['job_title_id', 'position_level_id', 'position_type_id', 'job_group_id', 'age', 'graduation_year'].includes(field)) {
            // แปลงเป็น integer สำหรับ field ที่เป็นตัวเลข
            const numValue = parseInt(cellValue, 10);
            if (!isNaN(numValue)) {
              employeeData[field] = numValue;
            }
          } else {
            employeeData[field] = cellValue.toString().trim();
          }
        }
      });

      // ข้ามแถวว่าง
      if (!employeeData.id) {
        continue;
      }

      // Validate และ normalize gender (ต้องเป็น 'ชาย' หรือ 'หญิง' เท่านั้น)
      if (employeeData.gender) {
        const genderValue = employeeData.gender.trim();
        const genderMapping = {
          'ชาย': 'ชาย',
          'หญิง': 'หญิง',
          'male': 'ชาย',
          'female': 'หญิง',
          'm': 'ชาย',
          'f': 'หญิง',
          '1': 'ชาย',
          '2': 'หญิง'
        };
        employeeData.gender = genderMapping[genderValue.toLowerCase()] || genderMapping[genderValue] || null;
      }

      // ตรวจสอบข้อมูลที่จำเป็น
      if (!employeeData.prefix_th || !employeeData.first_name_th || !employeeData.last_name_th || !employeeData.gender) {
        results.failed++;
        results.errors.push({
          row: rowNumber,
          id: employeeData.id,
          message: 'ข้อมูลไม่ครบ (ต้องมี คำนำหน้า, ชื่อ, นามสกุล, เพศ) หรือ gender ไม่ถูกต้อง (ต้องเป็น ชาย/หญิง)'
        });
        continue;
      }

      // ตั้งค่า default password ถ้าไม่มี (ใช้ id เป็น password)
      if (!employeeData.password) {
        employeeData.password = employeeData.id;
      }

      // Hash password
      employeeData.password = await bcrypt.hash(employeeData.password, saltRounds);

      // ตั้งค่า default role
      if (!employeeData.role || !['superadmin', 'admin', 'user'].includes(employeeData.role)) {
        employeeData.role = 'user';
      }

      // ตรวจสอบว่ามี employee อยู่แล้วหรือไม่
      const existing = await Employee.findByPk(employeeData.id);
      
      if (existing) {
        // Update existing employee (ไม่ update password ถ้ามีอยู่แล้ว)
        delete employeeData.password;
        await Employee.update(employeeData, { where: { id: employeeData.id } });
      } else {
        // Create new employee
        await Employee.create(employeeData);
      }

      results.success++;
    } catch (err) {
      results.failed++;
      results.errors.push({
        row: rowNumber,
        message: err.message
      });
    }
  }

  return results;
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  searchEmployeesByFirstName,
  getEmployeeSummary,
  getEmployeesByWorkStatus,
  getEmployeesByJobGroup,
  changePassword,
  importEmployeesFromExcel
};
