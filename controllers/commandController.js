const commandService = require('../services/commandService');
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');

const isAdmin = (user) =>
  user && ['admin', 'superadmin'].includes(user.role);

// -------------------- GET ALL --------------------
exports.getAll = async (req, res) => {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (isAdmin(user)) {
      return res.json(await commandService.getAllCommandsPaged(page, limit));
    }

    res.json(await commandService.getCommandsByEmployee(user.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- GET BY ID --------------------
exports.getById = async (req, res) => {
  try {
    const data = await commandService.getCommandById(req.params.id);
    if (!data) return res.status(404).json({ message: 'Not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- CREATE --------------------
exports.create = async (req, res) => {
  try {
    console.log('📥 Command Create - Received payload:', JSON.stringify(req.body, null, 2));
    console.log('📥 User:', req.user?.id, req.user?.role);
    
    // Validate required fields
    const { command_title, date } = req.body;
    
    if (!command_title || !date) {
      console.error('❌ Missing required fields:', {
        command_title: !!command_title,
        date: !!date
      });
      return res.status(400).json({ 
        message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
        missing: {
          command_title: !command_title,
          date: !date
        }
      });
    }

    const data = await commandService.createCommand(req.body);
    console.log('✅ Command created successfully:', data.command_id);
    res.status(201).json(data);
  } catch (err) {
    console.error('❌ Command Create Error:', err.message);
    console.error('Stack:', err.stack);
    
    // ส่ง error message ที่เป็นมิตรกับผู้ใช้
    const errorMessage = err.message.includes('Validation Error') 
      ? err.message 
      : err.message.includes('Foreign key')
      ? 'ข้อมูลพนักงานไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
      : 'เกิดข้อผิดพลาดในการสร้างคำสั่ง';
    
    res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// -------------------- UPDATE (ADMIN) --------------------
exports.update = async (req, res) => {
  try {
    console.log('📥 Command Update - Received payload:', JSON.stringify(req.body, null, 2));
    
    // ถ้ามี employees array ให้ใช้ updateCommandWithEmployees
    if (req.body.employees !== undefined) {
      const data = await commandService.updateCommandWithEmployees(
        req.params.id,
        req.body
      );
      
      if (!data) {
        return res.status(404).json({ message: 'Command not found' });
      }
      
      console.log('✅ Command updated with employees');
      return res.json(data);
    }
    
    // ถ้าไม่มี employees ให้ใช้ update ธรรมดา
    const data = await commandService.updateCommand(req.params.id, req.body);
    
    if (!data) {
      return res.status(404).json({ message: 'Command not found' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('❌ Command Update Error:', err.message);
    
    const errorMessage = err.message.includes('Validation Error')
      ? err.message
      : err.message.includes('Foreign key')
      ? 'ข้อมูลพนักงานไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'
      : 'เกิดข้อผิดพลาดในการแก้ไขคำสั่ง';
    
    res.status(500).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// -------------------- DELETE (ADMIN) --------------------
exports.delete = async (req, res) => {
  try {
    const data = await commandService.deleteCommand(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- UPLOAD FILE (ADMIN) --------------------
exports.uploadFile = async (req, res) => {
  try {
    const { command_id, employee_id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: 'file is required' });
    }

    const filePath = path.join('uploads', 'commands', req.file.filename);

    const row = await commandService.uploadCommandFile(
      command_id,
      employee_id,
      filePath
    );

    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- DOWNLOAD --------------------
exports.downloadFile = async (req, res) => {
  try {
    const { command_id, employee_id } = req.params;
    const user = req.user;

    if (!isAdmin(user) && user.id !== employee_id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const record = await commandService.getCommandFile(command_id, employee_id);
    if (!record || !record.command_file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, '..', record.command_file);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File missing' });
    }

    res.download(filePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- EXPORT COMMAND --------------------
exports.exportCommandsExcel = async (req, res) => {
  try {
    const rows = await commandService.getAllCommandsForExport();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Commands');

    ws.columns = [
      { header: 'ID', key: 'command_id', width: 10 },
      { header: 'ชื่อคำสั่ง', key: 'command_title', width: 30 },
      { header: 'รายละเอียด', key: 'command_detail', width: 30 },
      { header: 'วันที่', key: 'date', width: 15 },
      { header: 'หมายเหตุ', key: 'note', width: 30 }
    ];

    rows.forEach(r => ws.addRow(r.toJSON()));

    res.setHeader('Content-Disposition', 'attachment; filename=commands.xlsx');
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- EXPORT COMMAND EMPLOYEE --------------------
exports.exportCommandEmployeesExcel = async (req, res) => {
  try {
    const rows = await commandService.getAllCommandEmployeesForExport();

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('CommandEmployees');

    ws.columns = [
      { header: 'Command', key: 'command_title', width: 30 },
      { header: 'Employee ID', key: 'employee_id', width: 15 },
      { header: 'ชื่อพนักงาน', key: 'employee_name', width: 30 },
      { header: 'ไฟล์', key: 'command_file', width: 40 }
    ];

    rows.forEach(r => {
      ws.addRow({
        command_title: r.command?.command_title,
        employee_id: r.employee_id,
        employee_name: `${r.employee?.first_name_th || ''} ${r.employee?.last_name_th || ''}`,
        command_file: r.command_file
      });
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename=command_employees.xlsx'
    );
    await wb.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// -------------------- UPDATE EMPLOYEE JOB (ADMIN) --------------------
exports.updateEmployeeJob = async (req, res) => {
  try {
    const { command_id, employee_id } = req.params;
    const { command_job } = req.body;

    const row = await commandService.updateEmployeeJob(
      command_id,
      employee_id,
      command_job
    );

    if (!row) return res.status(404).json({ message: 'Not found' });
    res.json(row);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
