// Mock data for public endpoints when database is unavailable
// This allows the frontend to load even if database connection fails

const mockJobTitles = [
  { id: 1, job_title_name: 'ผู้อำนวยการ', job_title_name_en: 'Director' },
  { id: 2, job_title_name: 'รองผู้อำนวยการ', job_title_name_en: 'Deputy Director' },
  { id: 3, job_title_name: 'หัวหน้าแผนก', job_title_name_en: 'Department Head' },
  { id: 4, job_title_name: 'เจ้าหน้าที่', job_title_name_en: 'Officer' },
  { id: 5, job_title_name: 'ผู้ช่วยเจ้าหน้าที่', job_title_name_en: 'Assistant Officer' }
];

const mockPositionLevels = [
  { id: 1, position_level_name: 'ระดับสูง', position_level_name_en: 'Senior' },
  { id: 2, position_level_name: 'ระดับกลาง', position_level_name_en: 'Middle' },
  { id: 3, position_level_name: 'ระดับต้น', position_level_name_en: 'Junior' }
];

const mockPositionTypes = [
  { id: 1, position_type_name: 'ประจำ', position_type_name_en: 'Permanent' },
  { id: 2, position_type_name: 'สัญญา', position_type_name_en: 'Contract' },
  { id: 3, position_type_name: 'ชั่วคราว', position_type_name_en: 'Temporary' }
];

const mockJobGroups = [
  { id: 1, job_group_name: 'กลุ่มบริหาร', job_group_name_en: 'Administrative' },
  { id: 2, job_group_name: 'กลุ่มวิชาการ', job_group_name_en: 'Academic' },
  { id: 3, job_group_name: 'กลุ่มสนับสนุน', job_group_name_en: 'Support' }
];

const mockEmployeeSummary = {
  total_employees: 0,
  by_work_status: {
    'ปฏิบัติหน้าที่': 0,
    'หมดสัญญา': 0,
    'โอนย้าย': 0,
    'ลาออก': 0,
    'เสียชีวิต': 0
  },
  by_job_group: {},
  by_position_level: {},
  message: 'Database unavailable - showing empty summary'
};

module.exports = {
  mockJobTitles,
  mockPositionLevels,
  mockPositionTypes,
  mockJobGroups,
  mockEmployeeSummary
};
