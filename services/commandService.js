const { Command, CommandEmployee, Employee, JobTitle, PositionLevel, PositionType, JobGroup } = require('../models');
const sequelize = require('../config/database');

// =======================
// INCLUDE CONFIG (เหมือน meeting)
// =======================
const participantInclude = [
  {
    model: Employee,
    as: 'employee',
    required: false,
    include: [
      { model: JobTitle, as: 'jobTitle', required: false },
      { model: PositionLevel, as: 'positionLevel', required: false },
      { model: PositionType, as: 'positionType', required: false },
      { model: JobGroup, as: 'jobGroup', required: false }
    ]
  }
];

/* =======================
 * GET ALL (ADMIN PAGED)
 * ======================= */
exports.getAllCommandsPaged = async (page, limit) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Command.findAndCountAll({
    limit,
    offset,
    order: [['date', 'DESC']],
    include: [
      {
        model: CommandEmployee,
        as: 'commandEmployees',
        include: participantInclude
      }
    ]
  });

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit)
    }
  };
};

/* =======================
 * GET BY EMPLOYEE (USER)
 * ======================= */
exports.getCommandsByEmployee = async (employeeId) => {
  return Command.findAll({
    include: [
      {
        model: CommandEmployee,
        as: 'commandEmployees',
        where: { employee_id: employeeId },
        include: participantInclude
      }
    ],
    order: [['date', 'DESC']]
  });
};

/* =======================
 * GET BY ID
 * ======================= */
exports.getCommandById = async (id) => {
  return Command.findByPk(id, {
    include: [
      {
        model: CommandEmployee,
        as: 'commandEmployees',
        include: participantInclude
      }
    ]
  });
};

/* =======================
 * CREATE
 * ======================= */
exports.createCommand = async (data) => {
  const t = await sequelize.transaction();
  
  const startTime = Date.now();
  
  try {
    console.log('📝 Creating command with data:', JSON.stringify(data, null, 2));
    
    const { employees, ...commandData } = data;

    // แปลง empty string เป็น null สำหรับ optional fields
    if (commandData.command_detail === '') commandData.command_detail = null;
    if (commandData.note === '') commandData.note = null;

    const command = await Command.create(commandData, { transaction: t });
    console.log('✅ Command created:', command.command_id);

    if (Array.isArray(employees) && employees.length > 0) {
      console.log('👥 Processing employees:', employees);
      
      // Validate employees exist
      const employeeIds = employees.map(e => e.employee_id).filter(Boolean);
      
      if (employeeIds.length === 0) {
        console.log('⚠️ No valid employee IDs provided');
        await t.commit();
        return command;
      }

      // ตรวจสอบว่า employee IDs มีอยู่จริงในระบบ
      const existingEmployees = await Employee.findAll({
        where: { id: employeeIds },
        attributes: ['id'],
        transaction: t,
        raw: true
      });

      const existingIds = existingEmployees.map(e => e.id);
      const invalidIds = employeeIds.filter(id => !existingIds.includes(id));

      if (invalidIds.length > 0) {
        console.warn('⚠️ Invalid employee IDs (will be skipped):', invalidIds);
        console.warn('⚠️ These employees do not exist in tb_employee table');
      }

      // Insert เฉพาะ employee ที่มีอยู่จริง
      const validEmployees = employees.filter(e => e.employee_id && existingIds.includes(e.employee_id));
      
      if (validEmployees.length > 0) {
        const rows = validEmployees.map(e => ({
          command_id: command.command_id,
          employee_id: e.employee_id,
          command_job: e.command_job || null
        }));

        try {
          await CommandEmployee.bulkCreate(rows, { 
            transaction: t,
            validate: true
          });
          console.log(`✅ Added ${rows.length} employees to command`);
        } catch (bulkError) {
          console.error('❌ BulkCreate Error:', bulkError.message);
          // ถ้า bulk create ล้มเหลว ให้ลอง insert ทีละตัว
          console.log('🔄 Retrying with individual inserts...');
          for (const row of rows) {
            try {
              await CommandEmployee.create(row, { transaction: t });
              console.log(`✅ Added employee ${row.employee_id}`);
            } catch (individualError) {
              console.error(`❌ Failed to add employee ${row.employee_id}:`, individualError.message);
            }
          }
        }
      } else {
        console.log('⚠️ No valid employees to add');
      }
    }

    await t.commit();
    const duration = Date.now() - startTime;
    console.log(`✅ Transaction committed successfully (${duration}ms)`);
    return command;
  } catch (err) {
    await t.rollback();
    const duration = Date.now() - startTime;
    console.error(`❌ Command Create Error (${duration}ms):`, err.message);
    console.error('Error name:', err.name);
    console.error('Stack:', err.stack);
    console.error('Original payload:', JSON.stringify(data, null, 2));
    
    // Log SQL error details if available
    if (err.parent) {
      console.error('SQL Error Code:', err.parent.code);
      console.error('SQL Error:', err.parent.sqlMessage || err.parent.message);
    }
    
    // ส่ง error message ที่ชัดเจนกว่า
    if (err.name === 'SequelizeValidationError') {
      throw new Error(`Validation Error: ${err.errors.map(e => e.message).join(', ')}`);
    }
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      const detail = err.parent?.sqlMessage || 'Invalid employee or reference';
      throw new Error(`Foreign key error: ${detail}`);
    }
    if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
      throw new Error('Database connection error. Please try again.');
    }
    if (err.name === 'SequelizeTimeoutError') {
      throw new Error('Database timeout. Please try again.');
    }
    
    throw err;
  }
};

/* =======================
 * UPDATE
 * ======================= */
exports.updateCommand = async (id, data) => {
  const command = await Command.findByPk(id);
  if (!command) return null;

  await command.update(data);
  return command;
};

/* =======================
 * UPLOAD FILE
 * ======================= */
exports.uploadCommandFile = async (commandId, employeeId, filePath) => {
  const row = await CommandEmployee.findOne({
    where: { command_id: commandId, employee_id: employeeId }
  });

  if (!row) throw new Error('CommandEmployee not found');

  row.command_file = filePath;
  await row.save();
  return row;
};

/* =======================
 * DELETE
 * ======================= */
exports.deleteCommand = async (id) => {
  const t = await sequelize.transaction();
  try {
    await CommandEmployee.destroy({
      where: { command_id: id },
      transaction: t
    });

    const command = await Command.findByPk(id, { transaction: t });
    if (!command) return null;

    await command.destroy({ transaction: t });
    await t.commit();
    return command;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/* =======================
 * GET FILE
 * ======================= */
exports.getCommandFile = async (commandId, employeeId) => {
  return CommandEmployee.findOne({
    where: { command_id: commandId, employee_id: employeeId }
  });
};

/* =======================
 * EXPORT COMMAND
 * ======================= */
exports.getAllCommandsForExport = async () => {
  return Command.findAll({ order: [['date', 'DESC']] });
};

/* =======================
 * EXPORT COMMAND EMPLOYEE
 * ======================= */
exports.getAllCommandEmployeesForExport = async () => {
  return CommandEmployee.findAll({
    include: [
      { model: Command, as: 'command' },
      ...participantInclude
    ]
  });
};

/* =======================
 * UPDATE EMPLOYEE JOB (PER PERSON)
 * ======================= */
exports.updateEmployeeJob = async (commandId, employeeId, job) => {
  const row = await CommandEmployee.findOne({
    where: { command_id: commandId, employee_id: employeeId }
  });

  if (!row) return null;

  row.command_job = job;
  await row.save();
  return row;
};


/* =======================
 * UPDATE WITH EMPLOYEES (NEW)
===========================*/
exports.updateCommandWithEmployees = async (id, data) => {
  const t = await sequelize.transaction(); 
  const startTime = Date.now();

  try {
    console.log('📝 Updating command:', id, 'with data:', JSON.stringify(data, null, 2));

    const command = await Command.findByPk(id, { transaction: t });
    if (!command) {
      await t.rollback();
      return null;
    }

    // แยก employees ออกจาก command data
    const { employees, ...commandData } = data;

    // แปลง empty string เป็น null
    if (commandData.command_detail === '') commandData.command_detail = null;
    if (commandData.note === '') commandData.note = null;

    // Update command header
    await command.update(commandData, { transaction: t });
    console.log('✅ Command header updated');

    // ถ้ามี employees array ให้จัดการ
    if (Array.isArray(employees)) {
      console.log('👥 Processing employees update:', employees);

      // ลบ employees เดิมทั้งหมด
      await CommandEmployee.destroy({
        where: { command_id: id },
        transaction: t
      });
      console.log('🗑️ Removed old employees');

      // เพิ่ม employees ใหม่
      if (employees.length > 0) {
        const employeeIds = employees.map(e => e.employee_id).filter(Boolean);

        if (employeeIds.length > 0) {
          // ตรวจสอบว่า employee IDs มีอยู่จริง
          const existingEmployees = await Employee.findAll({
            where: { id: employeeIds },
            attributes: ['id'],
            transaction: t,
            raw: true
          });

          const existingIds = existingEmployees.map(e => e.id);
          const invalidIds = employeeIds.filter(id => !existingIds.includes(id));

          if (invalidIds.length > 0) {
            console.warn('⚠️ Invalid employee IDs (will be skipped):', invalidIds);
          }

          // Insert เฉพาะ employee ที่มีอยู่จริง
          const validEmployees = employees.filter(
            e => e.employee_id && existingIds.includes(e.employee_id)
          );

          if (validEmployees.length > 0) {
            const rows = validEmployees.map(e => ({
              command_id: id,
              employee_id: e.employee_id,
              command_job: e.command_job || null
            }));

            await CommandEmployee.bulkCreate(rows, {
              transaction: t,
              validate: true
            });

            console.log(`✅ Added ${rows.length} employees to command`);
          }
        }
      } else {
        console.log('ℹ️ No employees to add (empty array)');
      }
    }

    await t.commit();
    const duration = Date.now() - startTime;
    console.log(`✅ Command update transaction committed (${duration}ms)`);

    // Fetch updated command with employees
    return await Command.findByPk(id, {
      include: [{
        model: CommandEmployee,
        as: 'commandEmployees',
        include: participantInclude
      }]
    });

  } catch (err) {
    await t.rollback();
    const duration = Date.now() - startTime;
    console.error(`❌ Command Update Error (${duration}ms):`, err.message);
    console.error('Stack:', err.stack);

    if (err.parent) {
      console.error('SQL Error:', err.parent.sqlMessage || err.parent.message);
    }

    throw err;
  }
};

