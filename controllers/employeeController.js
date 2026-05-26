const employeeService = require('../services/employeeService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// -------------------- Register --------------------
const register = async (req, res) => {
  try {
    // ป้องกัน user ปกติสร้าง admin
    if (req.body.role === 'admin') req.body.role = 'user';
    const employee = await employeeService.createEmployee(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- Login --------------------
const login = async (req, res) => {
  try {
    const { id, password } = req.body;

    // ✅ ตรวจสอบว่า id และ password ถูกส่งมาหรือไม่
    if (!id || !password) {
      return res.status(400).json({ 
        message: 'กรุณากรอก id และ password',
        required: ['id', 'password']
      });
    }

    // ✅ ตรวจสอบว่า id เป็น string ที่ไม่ว่าง
    if (typeof id !== 'string' || id.trim() === '') {
      return res.status(400).json({ message: 'id ต้องเป็น string ที่ไม่ว่าง' });
    }

    // ✅ ตรวจสอบว่า password เป็น string ที่ไม่ว่าง
    if (typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ message: 'password ต้องเป็น string ที่ไม่ว่าง' });
    }

    // 🔑 Test user hardcoded (สำหรับ testing เท่านั้น)
    const testUser = {
      id: '0123456789123',
      password: '1234',
      role: 'user',
      first_name_th: 'ทดสอบ'
    };

    // ตรวจสอบ id และ password
    if (id.trim() === testUser.id && password === testUser.password) {
      const token = jwt.sign(
        { id: testUser.id, role: testUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({ 
        token,
        user: {
          id: testUser.id,
          role: testUser.role,
          name: testUser.first_name_th,
        },
      });
    }

    // ถ้าไม่ใช่ test user ให้ลองค้นหาจาก database
    try {
      const employee = await employeeService.getEmployeeById(id.trim());
      if (!employee) return res.status(404).json({ message: 'ไม่พบผู้ใช้งาน' });

      const match = await bcrypt.compare(password, employee.password);
      if (!match) return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });

      const token = jwt.sign(
        { id: employee.id, role: employee.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ 
        token,
        user: {
          id: employee.id,
          role: employee.role,
          name: employee.first_name_th ?? null,
        },
      });
    } catch (dbErr) {
      // ถ้า database ไม่ได้ ให้ return error
      console.error('❌ Database error:', dbErr.message);
      return res.status(401).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }
  } catch (err) {
    console.error('❌ [Login Error]:', err.message);
    console.error('Stack:', err.stack);
    res.status(500).json({ 
      message: err.message,
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// -------------------- CRUD --------------------
const getAll = async (req, res) => {
  const employees = await employeeService.getAllEmployees();
  res.json(employees);
};

// ✅ เพิ่ม function ใหม่สำหรับ public (ไม่ต้อง auth)
const getPublicAll = async (req, res) => {
  try {
    console.log('👥 [getPublicAll] Starting...');
    const employees = await employeeService.getAllEmployees();
    console.log(`✅ [getPublicAll] Found ${employees.length} employees`);
    
    // แปลงข้อมูลเป็น flat structure พร้อม job_title_name และ job_group_name
    const publicData = employees.map(emp => ({
      id: emp.id,
      prefix_th: emp.prefix_th,
      first_name_th: emp.first_name_th,
      last_name_th: emp.last_name_th,
      gender: emp.gender,
      age: emp.age,
      job_title_id: emp.job_title_id,
      job_title_name: emp.jobTitle?.job_title_name || null,
      position_level_id: emp.position_level_id,
      position_level_name: emp.positionLevel?.position_level_name || null,
      position_type_id: emp.position_type_id,
      position_type_name: emp.positionType?.position_type_name || null,
      job_group_id: emp.job_group_id,
      job_group_name: emp.jobGroup?.job_group_name || null,
      work_status: emp.work_status
    }));
    
    res.status(200).json(publicData);
  } catch (err) {
    console.error('❌ [getPublicAll] Error:', err.message);
    // Return empty array if database fails
    res.status(200).json([]);
  }
};

const getById = async (req, res) => {
  const employee = await employeeService.getEmployeeById(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Not found' });
  res.json(employee);
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    let updateData = { ...req.body };

    // จัดการรูปโปรไฟล์ถ้ามีการอัปโหลด
    if (req.file) {
      const fs = require('fs');
      // ลบรูปเก่าถ้ามี
      if (employee.profile_image && fs.existsSync(employee.profile_image)) {
        fs.unlinkSync(employee.profile_image);
      }
      updateData.profile_image = req.file.path.replace(/\\/g, '/'); // แปลง backslash เป็น forward slash
    }

    // ถ้ามีการส่ง profile_image เป็น null หรือ empty string (ต้องการลบรูป)
    if (req.body.profile_image === null || req.body.profile_image === '' || req.body.profile_image === 'null') {
      const fs = require('fs');
      // ลบรูปเก่า
      if (employee.profile_image && fs.existsSync(employee.profile_image)) {
        fs.unlinkSync(employee.profile_image);
      }
      updateData.profile_image = null;
    }

    if (req.user.role === 'user') {
      const allowedFields = [
        'prefix_th',
        'first_name_th',
        'last_name_th',
        'gender',
        'birt_date',
        'age',
        'phone_number',
        'job_title_id',
        'position_level_id',
        'position_type_id',
        'job_group_id',
        'email',
        'education_level',
        'degree_name',
        'institution_name',
        'graduation_year',
        'degree_for_employment',
        'highest_degree',
        'professional_license_degree',
        'profile_image'
      ];
      const filteredData = {};
      allowedFields.forEach(f => {
        if (updateData[f] !== undefined) filteredData[f] = updateData[f];
      });
      updateData = filteredData;
    }

    await employeeService.updateEmployee(id, updateData);
    res.json({ 
      message: 'Updated successfully',
      profile_image: updateData.profile_image || null
    });
  } catch (err) {
    // ลบไฟล์ที่อัปโหลดถ้าเกิด error
    if (req.file) {
      const fs = require('fs');
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting file:', unlinkErr);
      });
    }
    res.status(500).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await employeeService.getEmployeeById(id);
    if (employee) {
      // ลบรูปโปรไฟล์ถ้ามี
      if (employee.profile_image) {
        const fs = require('fs');
        if (fs.existsSync(employee.profile_image)) {
          fs.unlinkSync(employee.profile_image);
        }
      }
    }
    await employeeService.deleteEmployee(id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- 🔍 Search employee --------------------
const search = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);
    
    const employees = await employeeService.searchEmployeesByFirstName(q);
    
    // แปลงข้อมูลเป็น flat structure พร้อม job_title_name และ job_group_name
    const result = employees.map(emp => ({
      id: emp.id,
      prefix_th: emp.prefix_th,
      first_name_th: emp.first_name_th,
      last_name_th: emp.last_name_th,
      job_title_id: emp.job_title_id,
      job_title_name: emp.jobTitle?.job_title_name || null,
      job_group_id: emp.job_group_id,
      job_group_name: emp.jobGroup?.job_group_name || null
    }));
    
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- 📊 Employee Summary --------------------
const getSummary = async (req, res) => {
  try {
    const data = await employeeService.getEmployeeSummary();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- 📥 Import Excel --------------------
const importExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'กรุณาอัปโหลดไฟล์ Excel' });
    }

    const results = await employeeService.importEmployeesFromExcel(req.file.path);

    // ลบไฟล์หลัง import เสร็จ
    const fs = require('fs');
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Error deleting file:', err);
    });

    res.json({
      message: 'Import เสร็จสิ้น',
      results
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------- 🔍 Filter by Work Status --------------------
const filterByWorkStatus = async (req, res) => {
  try {
    const { status } = req.query;
    if (!status) {
      return res.status(400).json({ 
        message: 'กรุณาระบุ work_status',
        validStatuses: ['ปฏิบัติหน้าที่', 'หมดสัญญา', 'โอนย้าย', 'ลาออก', 'เสียชีวิต']
      });
    }

    const employees = await employeeService.getEmployeesByWorkStatus(status);
    res.json({
      work_status: status,
      count: employees.length,
      data: employees
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// -------------------- 🔍 Filter by Job Group --------------------
const filterByJobGroup = async (req, res) => {
  try {
    const { job_group_id } = req.query;
    if (!job_group_id) {
      return res.status(400).json({ message: 'กรุณาระบุ job_group_id' });
    }

    const employees = await employeeService.getEmployeesByJobGroup(job_group_id);
    res.json({
      job_group_id: parseInt(job_group_id),
      count: employees.length,
      data: employees
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// -------------------- 🔑 Change Password --------------------
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน (oldPassword, newPassword, confirmPassword)' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร' });
    }

    // เปลี่ยนรหัสผ่าน
    await employeeService.changePassword(req.user.id, oldPassword, newPassword);
    res.json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ เพิ่ม function สำหรับ public summary
const getPublicSummary = async (req, res) => {
  try {
    console.log('📊 [getPublicSummary] Starting...');
    const data = await employeeService.getEmployeeSummary();
    console.log('✅ [getPublicSummary] Success:', JSON.stringify(data));
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ [getPublicSummary] Error:', err.message);
    // Return empty summary if database fails
    const { mockEmployeeSummary } = require('../utils/mockData');
    res.status(200).json(mockEmployeeSummary);
  }
};

module.exports = {
  register,
  login,
  getAll,
  getPublicAll,
  getById,
  update,
  remove,
  search,
  getSummary,
  getPublicSummary,
  importExcel,
  filterByWorkStatus,
  filterByJobGroup,
  changePassword
};



