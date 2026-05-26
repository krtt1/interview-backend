const { Meeting, MeetingEmployee, Employee, JobTitle, PositionLevel, PositionType, JobGroup } = require('../models');
const sequelize = require('../config/database');
const { Transaction } = require("sequelize");

// INCLUDE CONFIG
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
 * GET ALL (PAGINATION)
 * ======================= */
exports.getAllMeetingsPaged = async (page, limit) => {
  const offset = (page - 1) * limit;

  const { rows, count } = await Meeting.findAndCountAll({
    limit,
    offset,
    order: [['start_date', 'DESC']],
    include: [
      {
        model: MeetingEmployee,
        as: 'meetingEmployees',
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
 * GET ALL FOR EXPORT
 * ======================= */
exports.getAllMeetingsForExport = async () => {
  return Meeting.findAll({
    attributes: [
      'meeting_id',
      'meeting_title',
      'start_date',
      'end_date',
      'meeting_type',
      'location',
      'organizer',
      'note',
      'created_at'
    ],
    order: [['start_date', 'DESC']]
  });
};

/* =======================
 * GET ALL FOR EXPORT MEETING-EMPLOYEE
 * ======================= */
exports.getAllMeetingEmployeesForExport = async () => {
  return MeetingEmployee.findAll({
    include: [
      {
        model: Meeting,
        as: 'meeting',
        attributes: ['meeting_title']
      },
      {
        model: Employee,
        as: 'employee',
        attributes: ['first_name_th', 'last_name_th']
      }
    ],
    order: [['meeting_id', 'DESC']]
  });
};

/* =======================
 * GET BY IDS
 * ======================= */
exports.getMeetingsByIds = async (ids) => {
  if (!ids || ids.length === 0) return [];

  return Meeting.findAll({
    where: { meeting_id: ids },
    include: [
      {
        model: MeetingEmployee,
        as: 'meetingEmployees',
        include: participantInclude
      }
    ]
  });
};

/* =======================
 * GET BY ID
 * ======================= */
exports.getMeetingById = async (id) => {
  return Meeting.findByPk(id, {
    include: [
      {
        model: MeetingEmployee,
        as: 'meetingEmployees',
        include: participantInclude
      }
    ]
  });
};

/* =======================
 * CREATE
 * ======================= */
exports.createMeeting = async (data) => {
  const startTime = Date.now();
  
  // Validate required fields first (before transaction)
  const requiredFields = ['start_date', 'end_date', 'topic', 'meeting_title', 'organizer', 'meeting_type'];
  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }
  
  // Validate meeting_type
  if (!['Onsite', 'Online'].includes(data.meeting_type)) {
    throw new Error('meeting_type must be either "Onsite" or "Online"');
  }
  
  const t = await sequelize.transaction({
  isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
  timeout: 30000
});
  
  try {
    console.log('📝 Creating meeting with data:', JSON.stringify(data, null, 2));
    
    const { participants, submit_date, ...meetingData } = data;

    // แปลง empty string เป็น null สำหรับ optional fields
    if (meetingData.budget_source === '') meetingData.budget_source = null;
    if (meetingData.note === '') meetingData.note = null;
    if (meetingData.location === '') meetingData.location = null;

    const meeting = await Meeting.create(meetingData, { 
      transaction: t,
      validate: true
    });
    console.log('✅ Meeting created:', meeting.meeting_id);

    // Handle participants (optional)
    if (Array.isArray(participants) && participants.length > 0) {
      console.log('👥 Processing participants:', participants.length, 'total');
      
      // Filter out invalid IDs
      const validParticipantIds = participants.filter(id => {
        if (!id) return false;
        const trimmed = String(id).trim();
        return trimmed !== '' && trimmed !== 'null' && trimmed !== 'undefined';
      });
      
      console.log('✅ Valid participant IDs:', validParticipantIds.length);
      
      if (validParticipantIds.length === 0) {
        console.log('⚠️ No valid participant IDs provided, skipping participants');
        await t.commit();
        const duration = Date.now() - startTime;
        console.log(`✅ Transaction committed (no participants) (${duration}ms)`);
        return meeting;
      }

      // Validate participants exist (with timeout)
      try {
        const existingEmployees = await Promise.race([
          Employee.findAll({
            where: { id: validParticipantIds },
            attributes: ['id'],
            transaction: t,
            raw: true
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Employee validation timeout')), 10000)
          )
        ]);

        const existingIds = existingEmployees.map(e => e.id);
        const invalidIds = validParticipantIds.filter(id => !existingIds.includes(id));

        if (invalidIds.length > 0) {
          console.warn('⚠️ Invalid employee IDs (will be skipped):', invalidIds);
        }

        // Insert เฉพาะ employee ที่มีอยู่จริง
        if (existingIds.length > 0) {
          const rows = existingIds.map(employee_id => ({
            meeting_id: meeting.meeting_id,
            employee_id,
            submit_date: submit_date || null,
            tracking_status: 'อยู่ระหว่างติดตาม'
          }));

          await MeetingEmployee.bulkCreate(rows, { 
            transaction: t,
            validate: true,
            ignoreDuplicates: true
          });
          console.log(`✅ Added ${rows.length} participants to meeting`);
        } else {
          console.log('⚠️ No valid participants to add (all IDs invalid)');
        }
      } catch (participantError) {
        console.error('❌ Participant processing error:', participantError.message);
        // Don't fail the whole transaction if participants fail
        console.log('⚠️ Continuing without participants');
      }
    }

    await t.commit();
    const duration = Date.now() - startTime;
    console.log(`✅ Transaction committed successfully (${duration}ms)`);
    return meeting;
  } catch (err) {
    await t.rollback();
    const duration = Date.now() - startTime;
    console.error(`❌ Meeting Create Error (${duration}ms):`, err.message);
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
    if (err.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Duplicate entry: This participant is already added to the meeting');
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
exports.updateMeeting = async (id, data) => {
  const t = await sequelize.transaction();
  try {
    const { participants, ...meetingData } = data;

    const meeting = await Meeting.findByPk(id, { transaction: t });
    if (!meeting) return null;

    await meeting.update(meetingData, { transaction: t });

    if (Array.isArray(participants)) {
      await MeetingEmployee.destroy({
        where: { meeting_id: id },
        transaction: t
      });

      const rows = participants.map(employee_id => ({
        meeting_id: id,
        employee_id,
        tracking_status: 'อยู่ระหว่างติดตาม'
      }));

      await MeetingEmployee.bulkCreate(rows, { transaction: t });
    }

    await t.commit();
    return meeting;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/* =======================
 * DELETE
 * ======================= */
exports.deleteMeeting = async (id) => {
  const t = await sequelize.transaction();
  try {
    await MeetingEmployee.destroy({
      where: { meeting_id: id },
      transaction: t
    });

    const meeting = await Meeting.findByPk(id, { transaction: t });
    if (!meeting) return null;

    await meeting.destroy({ transaction: t });
    await t.commit();
    return meeting;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/* =======================
 * ADD PARTICIPANTS
 * ======================= */
exports.addParticipants = async (meetingId, employeeIds, submit_date) => {
  const rows = employeeIds.map(employee_id => ({
    meeting_id: meetingId,
    employee_id,
    submit_date,
    tracking_status: 'อยู่ระหว่างติดตาม'
  }));

  await MeetingEmployee.bulkCreate(rows, {
    ignoreDuplicates: true
  });

  return { message: 'Participants added successfully' };
};

/* =======================
 * SUBMIT ATTACHMENT
 * ======================= */
exports.submitAttachment = async (meetingId, employeeId, filePath) => {
  const row = await MeetingEmployee.findOne({
    where: {
      meeting_id: meetingId,
      employee_id: employeeId
    }
  });

  if (!row) {
    throw new Error('Participant not found');
  }

  row.attachment_file = filePath;
  row.submit_date = new Date();
  row.tracking_status = 'ส่งแล้ว';

  await row.save();
  return row;
};

/* =======================
 * UPDATE LATE STATUS
 * ======================= */
exports.updateLateStatus = async (meetingId) => {
  const today = new Date();

  const rows = await MeetingEmployee.findAll({
    where: { meeting_id: meetingId }
  });

  for (const row of rows) {
    if (row.tracking_status === 'ส่งแล้ว') continue;
    if (!row.submit_date) continue;

    const deadline = new Date(row.submit_date);
    if (today > deadline) {
      row.tracking_status = 'เกินกำหนด';
      await row.save();
    }
  }
};

/* =======================
 * HELPER
 * ======================= */
exports.isUserParticipant = async (meetingId, employeeId) => {
  const row = await MeetingEmployee.findOne({
    where: {
      meeting_id: meetingId,
      employee_id: employeeId
    }
  });

  return !!row;
};

/* =======================
 * GET PARTICIPANTS SUMMARY
 * ======================= */
exports.getParticipantsSummary = async (meetingId) => {
  const participants = await MeetingEmployee.findAll({
    where: { meeting_id: meetingId },
    include: participantInclude
  });

  const summary = {
    total: participants.length,
    submitted: 0,
    pending: 0,
    late: 0
  };

  participants.forEach(p => {
    if (p.tracking_status === 'ส่งแล้ว') summary.submitted++;
    else if (p.tracking_status === 'เกินกำหนด') summary.late++;
    else summary.pending++;
  });

  return {
    summary,
    participants
  };
};