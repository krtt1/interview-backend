const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Capacity = sequelize.define('tb_capacity', {
  capacity_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  employee_id: {
    type: DataTypes.STRING(13),
    allowNull: false,
    unique: true,
    references: {
      model: 'tb_employee',
      key: 'id'
    }
  },
  
  // ข้อมูลพื้นฐาน
  prefix_name: { type: DataTypes.TEXT, allowNull: true, comment: 'คำนำหน้า' },
  full_name: { type: DataTypes.TEXT, allowNull: true, comment: 'ชื่อ-นามสกุล' },
  department: { type: DataTypes.TEXT, allowNull: true, comment: 'ศูนย์/กลุ่ม/งาน' },
  age: { type: DataTypes.INTEGER, allowNull: true, comment: 'อายุ' },
  education_level: { type: DataTypes.TEXT, allowNull: true, comment: 'ระดับการศึกษา' },
  work_duration_years: { type: DataTypes.TEXT, allowNull: true, comment: 'ระยะเวลาในการปฏิบัติงานที่ สคร.1' },
  
  // ทักษะพื้นฐาน
  skill_official_writing: { type: DataTypes.TEXT, allowNull: true, comment: 'การเขียนหนังสือราชการ' },
  skill_meeting_summary: { type: DataTypes.TEXT, allowNull: true, comment: 'การสรุปการประชุม' },
  skill_computer_connection: { type: DataTypes.TEXT, allowNull: true, comment: 'การใช้คอมพิวเตอร์และการเชื่อมต่ออุปกรณ์' },
  skill_communication: { type: DataTypes.TEXT, allowNull: true, comment: 'การสื่อสารและประสานงาน' },
  skill_epidemiology_basic: { type: DataTypes.TEXT, allowNull: true, comment: 'หลักระบาดวิทยา และสถิติเบื้องต้น' },
  skill_excel: { type: DataTypes.TEXT, allowNull: true, comment: 'ทักษะการใช้โปรแกรม Excel' },
  skill_presentation: { type: DataTypes.TEXT, allowNull: true, comment: 'ทักษะการใช้โปรแกรมนำเสนอ Powerpoint หรือ Canva' },
  skill_ai_tools: { type: DataTypes.TEXT, allowNull: true, comment: 'ทักษะการใช้โปรแกรม AI' },
  skill_english_speaking: { type: DataTypes.TEXT, allowNull: true, comment: 'ภาษาอังกฤษ พูด ฟัง' },
  skill_english_writing: { type: DataTypes.TEXT, allowNull: true, comment: 'ภาษาอังกฤษ อ่าน เขียน' },
  
  // คะแนนภาษาอังกฤษ
  english_test_score: { type: DataTypes.TEXT, allowNull: true, comment: 'หากมีคะแนนสอบภาษาอังกฤษ ภายในระยะเวลา 2 ปี' },
  
  // First Aid & CPR
  has_first_aid_course: { type: DataTypes.TEXT, allowNull: true, comment: 'เคยผ่านหลักสูตรการปฐมพยาบาลเบื้องต้นและการช่วยฟื้นคืนชีพ (First Aid & CPR)' },
  skill_first_aid: { type: DataTypes.TEXT, allowNull: true, comment: 'ทักษะการปฐมพยาบาลและการช่วยชีวิตเบื้องต้น' },
  
  // ทักษะ/ประสบการณ์พิเศษ
  special_skills_experience: { type: DataTypes.TEXT, allowNull: true, comment: 'ท่านมีทักษะ/ประสบการณ์ดังต่อไปนี้' },
  
  // ประสบการณ์ Liaison
  liaison_experience: { type: DataTypes.TEXT, allowNull: true, comment: 'ประสบการณ์การเป็นผู้ประสานงาน / เคยปฏิบัติหน้าที่ Liaison' },
  
  // Competency
  competency_analytical_thinking: { type: DataTypes.TEXT, allowNull: true, comment: 'การคิดวิเคราะห์ (Analytical Thinking)' },
  competency_information_seeking: { type: DataTypes.TEXT, allowNull: true, comment: 'การสืบเสาะหาข้อมูล (Information Seeking)' },
  competency_strategic_orientation: { type: DataTypes.TEXT, allowNull: true, comment: 'การวางกลยุทธ์ (Strategic Orientation)' },
  
  // ทักษะระบาดวิทยา
  epi_surveillance: { type: DataTypes.STRING(50), allowNull: true, comment: 'เฝ้าระวัง ตรวจจับ ตรวจสอบ และประเมินความเสี่ยงเหตุการณ์ผิดปกติ' },
  epi_situation_report: { type: DataTypes.STRING(50), allowNull: true, comment: 'การเขียนรายงานสถานการณ์' },
  epi_data_analysis: { type: DataTypes.STRING(50), allowNull: true, comment: 'วิเคราะห์ข้อมูล พยากรณ์โรค' },
  epi_investigation_control: { type: DataTypes.STRING(50), allowNull: true, comment: 'ดำเนินการสอบสวน และควบคุมป้องกันโรค ตามขั้นตอน กระบวนการ' },
  epi_tool_design: { type: DataTypes.STRING(50), allowNull: true, comment: 'สามารถออกแบบเครื่องมือเก็บข้อมูลทางระบาดวิทยา Line List Data' },
  epi_descriptive_analysis: { type: DataTypes.STRING(50), allowNull: true, comment: 'วิเคราะห์ข้อมูลเชิงพรรณนา' },
  epi_analytical_statistics: { type: DataTypes.STRING(50), allowNull: true, comment: 'มีทักษะวิเคราะห์ข้อมูลเชิงวิเคราะห์ การใช้สถิติหาค่า RR/OR' },
  epi_advanced_software: { type: DataTypes.STRING(50), allowNull: true, comment: 'ทักษะการใช้โปรแกรมวิเคราะห์ข้อมูลขั้นสูง' },
  epi_explain_descriptive: { type: DataTypes.STRING(50), allowNull: true, comment: 'สามารถอธิบายระบาดวิทยาเชิงพรรณา สาเหตุปัจจัยเสี่ยง' },
  epi_explain_analytical: { type: DataTypes.STRING(50), allowNull: true, comment: 'สามารถอธิบายระบาดวิทยาเชิงวิเคราะห์ สาเหตุปัจจัยเสี่ยง' },
  epi_report_writing: { type: DataTypes.STRING(50), allowNull: true, comment: 'ทักษะการเขียนรายงานสอบสวนโรค' },
  
  // ทักษะการเก็บตัวอย่าง
  sample_nasopharyngeal: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง Nasopharyngeal swab' },
  sample_throat: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง Throat swab' },
  sample_rectal: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง Rectal swab' },
  sample_wound: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง Swab แผล' },
  sample_hand: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง Swab มือ' },
  sample_object: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง Swab ภาชนะ สิ่งของ' },
  sample_vomit: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง อาเจียน' },
  sample_water: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง จากก๊อก บ่อ แหล่งน้ำ' },
  sample_ice: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง น้ำแข็ง' },
  sample_food: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง อาหาร' },
  sample_blood_finger: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง เลือด (ปลายนิ้ว)' },
  sample_blood_vein: { type: DataTypes.TEXT, allowNull: true, comment: 'การเก็บตัวอย่าง เลือด (หลอดเลือดดำ)' },
  sample_transport: { type: DataTypes.TEXT, allowNull: true, comment: 'การบรรจุและขนส่งตัวอย่าง' },
  
  // ทักษะ PPE และความปลอดภัย
  ppe_standard: { type: DataTypes.TEXT, allowNull: true, comment: 'ความสามารถในการใส่-ถอด ชุดป้องกัน Standard PPE' },
  ppe_full: { type: DataTypes.TEXT, allowNull: true, comment: 'ความสามารถในการใส่-ถอด ชุดป้องกัน Full PPE' },
  waste_management: { type: DataTypes.TEXT, allowNull: true, comment: 'การจัดการขยะติดเชื้อ' },
  zone_identification: { type: DataTypes.TEXT, allowNull: true, comment: 'การระบุพื้นที่ปราศจากเชื้อ พื้นที่ปลอดภัย' },
  shelter_area_allocation: { type: DataTypes.TEXT, allowNull: true, comment: 'การจัดสรรพื้นที่ในศูนย์พักพิงชั่วคราว' },
  shelter_organization: { type: DataTypes.TEXT, allowNull: true, comment: 'การจัดระเบียบพื้นที่' },
  shelter_sanitation: { type: DataTypes.TEXT, allowNull: true, comment: 'การจัดระบบสุขาภิบาลสิ่งแวดล้อมในที่พักชั่วคราว' },
  
  // วิชาชีพแพทย์/พยาบาล
  has_medical_license: { type: DataTypes.TEXT, allowNull: true, comment: 'มีใบประกอบวิชาชีพแพทย์ศาสตร์บัณฑิตหรือพยาบาลศาสตร์บัณฑิต' },
  is_practicing_medical: { type: DataTypes.TEXT, allowNull: true, comment: 'ปัจจุบันยังปฏิบัติงานตามวิชาชีพอยู่' },
  screening_expertise: { type: DataTypes.TEXT, allowNull: true, comment: 'ความเชี่ยวชาญและประสบการณ์ด้านการคัดกรองโรค' },
  
  // งานวัคซีน
  vaccine_work_analysis: { type: DataTypes.TEXT, allowNull: true, comment: 'งานสร้างเสริมภูมิคุ้มกันโรค วิเคราะห์ข้อมูล ประเมินความเสี่ยง' },
  vaccine_aefi_surveillance: { type: DataTypes.TEXT, allowNull: true, comment: 'การเฝ้าระวังเหตุการณ์อาการไม่พึงประสงค์หลังจากได้รับวัคซีน(AEFI)' },
  vaccine_investigation: { type: DataTypes.TEXT, allowNull: true, comment: 'การสอบสวนโรค สอบสวนการระบาดโรคที่ป้องกันด้วยวัคซีน' },
  
  // งานโรคติดต่อนำโดยแมลง
  vector_diagnosis_experience: { type: DataTypes.TEXT, allowNull: true, comment: 'มีประสบการณ์ด้านการตรวจวินิจฉัยโรคติดต่อนำโดยแมลง ภาคสนาม' },
  vector_field_diagnosis: { type: DataTypes.TEXT, allowNull: true, comment: 'ทักษะการตรวจโรคติดต่อนำโดยแมลงภาคสนาม' },
  vector_investigation: { type: DataTypes.TEXT, allowNull: true, comment: 'การสอบสวนโรคติดต่อนำโดยแมลง' },
  vector_control: { type: DataTypes.TEXT, allowNull: true, comment: 'การควบคุมโรคติดต่อนำโดยแมลง' },
  
  // งานด่าน
  port_sanitation: { type: DataTypes.TEXT, allowNull: true, comment: 'การสุขาภิบาลสิ่งแวดล้อมในช่องทาง' },
  port_patient_transfer: { type: DataTypes.TEXT, allowNull: true, comment: 'การส่งต่อผู้ป่วยระหว่างประเทศ' },
  port_law: { type: DataTypes.TEXT, allowNull: true, comment: 'กฎหมายที่เกี่ยวข้องกับด่าน' },
  
  // งาน EnvOcc
  envocc_surveillance: { type: DataTypes.TEXT, allowNull: true, comment: 'การเฝ้าระวัง ป้องกัน ควบคุมโรคจากการประกอบอาชีพ' },
  envocc_tools: { type: DataTypes.TEXT, allowNull: true, comment: 'การใช้เครื่องมือสุขศาสตร์อุตสาหกรรม' },
  
  // Risk Communication
  risk_comm_crisis: { type: DataTypes.TEXT, allowNull: true, comment: 'การจัดการประเด็นข่าวเกี่ยวกับโรคหรือภัยสุขภาพและภาวะวิกฤต' },
  risk_comm_simplify: { type: DataTypes.TEXT, allowNull: true, comment: 'การสกัดประเด็นหลักและสื่อสารให้เข้าใจง่าย' },
  risk_comm_digital: { type: DataTypes.TEXT, allowNull: true, comment: 'การใช้เทคโนโลยีดิจิทัล เพื่อการสื่อสารความเสี่ยง' },
  
  // เทคนิคการแพทย์
  has_med_tech_license: { type: DataTypes.TEXT, allowNull: true, comment: 'มีใบประกอบวิชาชีพเทคนิคการแพทย์ ที่ไม่หมดอายุ' },
  lab_experience: { type: DataTypes.TEXT, allowNull: true, comment: 'มีประสบการณ์การทำงานในห้องปฏิบัติการอย่างน้อย 1 ปี' },
  lab_specific_tasks: { type: DataTypes.TEXT, allowNull: true, comment: 'ภาระกิจเฉพาะวิชาชีพ' },
  has_lab_safety_course: { type: DataTypes.TEXT, allowNull: true, comment: 'ท่านเคยผ่านการอบรมหลักสูตรความปลอดภัยในห้องปฏิบัติการหรือไม่' },
  
  // การแต่งตั้ง
  is_appointed_disease_control: { type: DataTypes.TEXT, allowNull: true, comment: 'ได้รับแต่งตั้งเป็นเจ้าพนักงานควบคุมโรคติดต่อตาม พรบ.โรคติดต่อ 2558' },
  is_appointed_envocc: { type: DataTypes.TEXT, allowNull: true, comment: 'ได้รับแต่งตั้งเป็นพนักงานเจ้าหน้าที่ ตาม พรบ.โรคจากการประกอบอาชีพ 2562' },
  is_appointed_tobacco_alcohol: { type: DataTypes.TEXT, allowNull: true, comment: 'ได้รับแต่งตั้งเป็นพนักงานเจ้าหน้าที่ ตาม พรบ. ควบคุมผลิตภัณฑ์ยาสูบ และแอลกอฮอล์' },
  
  // ทักษะกฎหมาย
  law_enforcement: { type: DataTypes.TEXT, allowNull: true, comment: 'การบังคับใช้กฎหมายด้านการป้องกันควบคุมโรคและภัยสุขภาพ' },
  law_regulation_drafting: { type: DataTypes.TEXT, allowNull: true, comment: 'การจัดทำคำสั่งหรือแนวทาง ระเบียบปฏิบัติ' },
  
  // โลจิสติกส์
  logistics_experience: { type: DataTypes.TEXT, allowNull: true, comment: 'การบริหารจัดการคลังเวชภัณฑ์และโลจิสติกส์' },
  
  // สมรรถนะทางกาย
  physical_fitness: { type: DataTypes.TEXT, allowNull: true, comment: 'สมรรถนะทางกาย' },
  
  // การบริหารจัดการ
  management_hr: { type: DataTypes.TEXT, allowNull: true, comment: 'การบริหารจัดการบุคลากร' },
  management_hr_development: { type: DataTypes.TEXT, allowNull: true, comment: 'การพัฒนาบุคลากรเพื่อตอบโต้ภาวะฉุกฉิน' },
  
  // การจัดซื้อจัดจ้าง
  procurement_emergency: { type: DataTypes.TEXT, allowNull: true, comment: 'การจัดซื้อจัดจ้าง ในภาวะฉุกเฉิน' },
  
  // IT & Facility
  it_computer_repair: { type: DataTypes.TEXT, allowNull: true, comment: 'การซ่อมบำรุงคอมพิวเตอร์' },
  it_equipment_management: { type: DataTypes.TEXT, allowNull: true, comment: 'การบริหารจัดการครุภัณฑ์คอมพิวเตอร์' },
  facility_vehicle_management: { type: DataTypes.TEXT, allowNull: true, comment: 'การบริหารจัดการยานพาหนะ' },
  facility_backup_site: { type: DataTypes.TEXT, allowNull: true, comment: 'การบริหารจัดการสถานที่ปฏิบัติงานสำรอง' }
  
}, {
  tableName: 'tb_capacity',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  underscored: true
});

module.exports = Capacity;
