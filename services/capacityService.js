const { 
  Capacity, 
  CapacityTrainingCourses,
  CapacityVectorCourses,
  CapacityEnvoccCourses,
  CapacityLawCourses,
  CapacityOtherExperiences,
  Employee 
} = require('../models');
const sequelize = require('../config/database');
const ExcelJS = require('exceljs');

class CapacityService {
  // สร้างหรืออัปเดตข้อมูลสมรรถนะ
  async createOrUpdateCapacity(employeeId, capacityData) {
    const transaction = await sequelize.transaction();
    
    try {
      // ตรวจสอบว่า employee มีอยู่จริง
      const employee = await Employee.findByPk(employeeId);
      if (!employee) {
        throw new Error('ไม่พบข้อมูล employee');
      }

      // แยกข้อมูลที่เป็น array (เลือกได้มากกว่า 1 ข้อ) ออกจาก capacityData
      const { 
        trainingCourses, 
        vectorCourses, 
        envoccCourses, 
        lawCourses, 
        otherExperiences,
        ...mainData 
      } = capacityData;

      // ตรวจสอบว่ามีข้อมูล capacity อยู่แล้วหรือไม่
      let capacity = await Capacity.findOne({ where: { employee_id: employeeId } });

      if (capacity) {
        // อัปเดตข้อมูลเดิม
        await capacity.update(mainData, { transaction });
      } else {
        // สร้างใหม่
        capacity = await Capacity.create({
          employee_id: employeeId,
          ...mainData
        }, { transaction });
      }

      // จัดการ trainingCourses (ลบเก่า สร้างใหม่)
      if (trainingCourses && Array.isArray(trainingCourses)) {
        await CapacityTrainingCourses.destroy({
          where: { employee_id: employeeId },
          transaction
        });
        
        if (trainingCourses.length > 0) {
          // รองรับทั้ง string[] และ object[]
          const coursesData = trainingCourses.map(course => ({
            employee_id: employeeId,
            course_name: typeof course === 'string' ? course : course.course_name
          }));
          await CapacityTrainingCourses.bulkCreate(coursesData, { transaction });
        }
      }

      // จัดการ vectorCourses
      if (vectorCourses && Array.isArray(vectorCourses)) {
        await CapacityVectorCourses.destroy({
          where: { employee_id: employeeId },
          transaction
        });
        
        if (vectorCourses.length > 0) {
          const coursesData = vectorCourses.map(course => ({
            employee_id: employeeId,
            course_name: typeof course === 'string' ? course : course.course_name
          }));
          await CapacityVectorCourses.bulkCreate(coursesData, { transaction });
        }
      }

      // จัดการ envoccCourses
      if (envoccCourses && Array.isArray(envoccCourses)) {
        await CapacityEnvoccCourses.destroy({
          where: { employee_id: employeeId },
          transaction
        });
        
        if (envoccCourses.length > 0) {
          const coursesData = envoccCourses.map(course => ({
            employee_id: employeeId,
            course_name: typeof course === 'string' ? course : course.course_name
          }));
          await CapacityEnvoccCourses.bulkCreate(coursesData, { transaction });
        }
      }

      // จัดการ lawCourses
      if (lawCourses && Array.isArray(lawCourses)) {
        await CapacityLawCourses.destroy({
          where: { employee_id: employeeId },
          transaction
        });
        
        if (lawCourses.length > 0) {
          const coursesData = lawCourses.map(course => ({
            employee_id: employeeId,
            course_name: typeof course === 'string' ? course : course.course_name
          }));
          await CapacityLawCourses.bulkCreate(coursesData, { transaction });
        }
      }

      // จัดการ otherExperiences
      if (otherExperiences && Array.isArray(otherExperiences)) {
        await CapacityOtherExperiences.destroy({
          where: { employee_id: employeeId },
          transaction
        });
        
        if (otherExperiences.length > 0) {
          const experiencesData = otherExperiences.map(exp => ({
            employee_id: employeeId,
            experience_name: typeof exp === 'string' ? exp : exp.experience_name
          }));
          await CapacityOtherExperiences.bulkCreate(experiencesData, { transaction });
        }
      }

      await transaction.commit();

      // ดึงข้อมูลที่สมบูรณ์พร้อมทุก relations
      return await this.getCapacityByEmployeeId(employeeId);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // ดึงข้อมูลสมรรถนะตาม employee_id
  async getCapacityByEmployeeId(employeeId) {
    const capacity = await Capacity.findOne({
      where: { employee_id: employeeId },
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'prefix_th', 'first_name_th', 'last_name_th', 'email']
        },
        {
          model: CapacityTrainingCourses,
          as: 'trainingCourses',
          attributes: ['id', 'course_name']
        },
        {
          model: CapacityVectorCourses,
          as: 'vectorCourses',
          attributes: ['id', 'course_name']
        },
        {
          model: CapacityEnvoccCourses,
          as: 'envoccCourses',
          attributes: ['id', 'course_name']
        },
        {
          model: CapacityLawCourses,
          as: 'lawCourses',
          attributes: ['id', 'course_name']
        },
        {
          model: CapacityOtherExperiences,
          as: 'otherExperiences',
          attributes: ['id', 'experience_name']
        }
      ]
    });

    if (!capacity) {
      return null;
    }

    return capacity;
  }

  // ดึงข้อมูลสมรรถนะทั้งหมด
  async getAllCapacities() {
    const capacities = await Capacity.findAll({
      include: [
        {
          model: Employee,
          as: 'employee',
          attributes: ['id', 'prefix_th', 'first_name_th', 'last_name_th', 'email']
        },
        {
          model: CapacityTrainingCourses,
          as: 'trainingCourses',
          attributes: ['id', 'course_name']
        },
        {
          model: CapacityVectorCourses,
          as: 'vectorCourses',
          attributes: ['id', 'course_name']
        },
        {
          model: CapacityEnvoccCourses,
          as: 'envoccCourses',
          attributes: ['id', 'course_name']
        },
        {
          model: CapacityLawCourses,
          as: 'lawCourses',
          attributes: ['id', 'course_name']
        },
        {
          model: CapacityOtherExperiences,
          as: 'otherExperiences',
          attributes: ['id', 'experience_name']
        }
      ],
      order: [['updated_at', 'DESC']]
    });

    return capacities;
  }

  // ลบข้อมูลสมรรถนะ
  async deleteCapacity(employeeId) {
    const transaction = await sequelize.transaction();
    
    try {
      const capacity = await Capacity.findOne({ where: { employee_id: employeeId } });
      
      if (!capacity) {
        throw new Error('ไม่พบข้อมูลสมรรถนะ');
      }

      // ลบข้อมูลในตารางที่เกี่ยวข้องทั้งหมด (ใช้ employee_id)
      await CapacityTrainingCourses.destroy({
        where: { employee_id: employeeId },
        transaction
      });

      await CapacityVectorCourses.destroy({
        where: { employee_id: employeeId },
        transaction
      });

      await CapacityEnvoccCourses.destroy({
        where: { employee_id: employeeId },
        transaction
      });

      await CapacityLawCourses.destroy({
        where: { employee_id: employeeId },
        transaction
      });

      await CapacityOtherExperiences.destroy({
        where: { employee_id: employeeId },
        transaction
      });

      // ลบ capacity
      await capacity.destroy({ transaction });

      await transaction.commit();
      return { message: 'ลบข้อมูลสมรรถนะสำเร็จ' };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // Export ข้อมูลเป็น Excel
  async exportToExcel() {
    try {
      const capacities = await this.getAllCapacities();

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('ข้อมูลสมรรถนะบุคลากร');

      // กำหนด columns ครบทุกฟิลด์
      worksheet.columns = [
        // ข้อมูลพื้นฐาน
        { header: 'รหัสพนักงาน', key: 'employee_id', width: 15 },
        { header: 'คำนำหน้า', key: 'prefix_name', width: 10 },
        { header: 'ชื่อ-นามสกุล', key: 'full_name', width: 30 },
        { header: 'แผนก', key: 'department', width: 30 },
        { header: 'อายุ', key: 'age', width: 10 },
        { header: 'ระดับการศึกษา', key: 'education_level', width: 20 },
        { header: 'ระยะเวลาปฏิบัติงาน', key: 'work_duration_years', width: 20 },
        
        // ทักษะพื้นฐาน
        { header: 'การเขียนหนังสือราชการ', key: 'skill_official_writing', width: 20 },
        { header: 'การสรุปการประชุม', key: 'skill_meeting_summary', width: 20 },
        { header: 'การใช้คอมพิวเตอร์', key: 'skill_computer_connection', width: 20 },
        { header: 'การสื่อสาร', key: 'skill_communication', width: 15 },
        { header: 'หลักระบาดวิทยา', key: 'skill_epidemiology_basic', width: 20 },
        { header: 'Excel', key: 'skill_excel', width: 15 },
        { header: 'PowerPoint', key: 'skill_presentation', width: 15 },
        { header: 'AI Tools', key: 'skill_ai_tools', width: 15 },
        { header: 'ภาษาอังกฤษ พูด-ฟัง', key: 'skill_english_speaking', width: 20 },
        { header: 'ภาษาอังกฤษ อ่าน-เขียน', key: 'skill_english_writing', width: 20 },
        { header: 'คะแนนภาษาอังกฤษ', key: 'english_test_score', width: 30 },
        { header: 'ผ่าน First Aid', key: 'has_first_aid_course', width: 15 },
        { header: 'ทักษะ First Aid', key: 'skill_first_aid', width: 15 },
        
        // ทักษะพิเศษ
        { header: 'ทักษะ/ประสบการณ์พิเศษ', key: 'special_skills_experience', width: 40 },
        { header: 'ประสบการณ์ Liaison', key: 'liaison_experience', width: 20 },
        
        // Competency
        { header: 'Analytical Thinking', key: 'competency_analytical_thinking', width: 20 },
        { header: 'Information Seeking', key: 'competency_information_seeking', width: 20 },
        { header: 'Strategic Orientation', key: 'competency_strategic_orientation', width: 20 },
        
        // ทักษะระบาดวิทยา
        { header: 'เฝ้าระวังโรค', key: 'epi_surveillance', width: 15 },
        { header: 'รายงานสถานการณ์', key: 'epi_situation_report', width: 15 },
        { header: 'วิเคราะห์ข้อมูล', key: 'epi_data_analysis', width: 15 },
        { header: 'สอบสวนควบคุมโรค', key: 'epi_investigation_control', width: 20 },
        { header: 'ออกแบบเครื่องมือ', key: 'epi_tool_design', width: 15 },
        { header: 'วิเคราะห์เชิงพรรณนา', key: 'epi_descriptive_analysis', width: 20 },
        { header: 'วิเคราะห์เชิงวิเคราะห์', key: 'epi_analytical_statistics', width: 20 },
        { header: 'โปรแกรมขั้นสูง', key: 'epi_advanced_software', width: 15 },
        { header: 'อธิบายเชิงพรรณนา', key: 'epi_explain_descriptive', width: 20 },
        { header: 'อธิบายเชิงวิเคราะห์', key: 'epi_explain_analytical', width: 20 },
        { header: 'เขียนรายงาน', key: 'epi_report_writing', width: 15 },
        
        // การเก็บตัวอย่าง
        { header: 'Nasopharyngeal', key: 'sample_nasopharyngeal', width: 15 },
        { header: 'Throat', key: 'sample_throat', width: 15 },
        { header: 'Rectal', key: 'sample_rectal', width: 15 },
        { header: 'Wound', key: 'sample_wound', width: 15 },
        { header: 'Hand', key: 'sample_hand', width: 15 },
        { header: 'Object', key: 'sample_object', width: 15 },
        { header: 'Vomit', key: 'sample_vomit', width: 15 },
        { header: 'Water', key: 'sample_water', width: 15 },
        { header: 'Ice', key: 'sample_ice', width: 15 },
        { header: 'Food', key: 'sample_food', width: 15 },
        { header: 'Blood Finger', key: 'sample_blood_finger', width: 15 },
        { header: 'Blood Vein', key: 'sample_blood_vein', width: 15 },
        { header: 'Transport', key: 'sample_transport', width: 15 },
        
        // PPE & ความปลอดภัย
        { header: 'PPE Standard', key: 'ppe_standard', width: 15 },
        { header: 'PPE Full', key: 'ppe_full', width: 15 },
        { header: 'Waste Management', key: 'waste_management', width: 15 },
        { header: 'Zone ID', key: 'zone_identification', width: 15 },
        { header: 'Shelter Area', key: 'shelter_area_allocation', width: 15 },
        { header: 'Shelter Org', key: 'shelter_organization', width: 15 },
        { header: 'Shelter Sanitation', key: 'shelter_sanitation', width: 15 },
        
        // วิชาชีพแพทย์/พยาบาล
        { header: 'Medical License', key: 'has_medical_license', width: 15 },
        { header: 'Practicing', key: 'is_practicing_medical', width: 15 },
        { header: 'Screening', key: 'screening_expertise', width: 15 },
        
        // งานวัคซีน
        { header: 'Vaccine Analysis', key: 'vaccine_work_analysis', width: 15 },
        { header: 'AEFI Surveillance', key: 'vaccine_aefi_surveillance', width: 15 },
        { header: 'Vaccine Investigation', key: 'vaccine_investigation', width: 15 },
        
        // โรคติดต่อนำโดยแมลง
        { header: 'Vector Diagnosis', key: 'vector_diagnosis_experience', width: 20 },
        { header: 'Vector Field', key: 'vector_field_diagnosis', width: 15 },
        { header: 'Vector Investigation', key: 'vector_investigation', width: 15 },
        { header: 'Vector Control', key: 'vector_control', width: 15 },
        
        // งานด่าน
        { header: 'Port Sanitation', key: 'port_sanitation', width: 15 },
        { header: 'Port Transfer', key: 'port_patient_transfer', width: 15 },
        { header: 'Port Law', key: 'port_law', width: 15 },
        
        // EnvOcc
        { header: 'EnvOcc Surveillance', key: 'envocc_surveillance', width: 15 },
        { header: 'EnvOcc Tools', key: 'envocc_tools', width: 15 },
        
        // Risk Communication
        { header: 'Crisis Comm', key: 'risk_comm_crisis', width: 15 },
        { header: 'Simplify Comm', key: 'risk_comm_simplify', width: 15 },
        { header: 'Digital Comm', key: 'risk_comm_digital', width: 15 },
        
        // เทคนิคการแพทย์
        { header: 'Med Tech License', key: 'has_med_tech_license', width: 15 },
        { header: 'Lab Experience', key: 'lab_experience', width: 20 },
        { header: 'Lab Tasks', key: 'lab_specific_tasks', width: 30 },
        { header: 'Lab Safety', key: 'has_lab_safety_course', width: 15 },
        
        // การแต่งตั้ง
        { header: 'Disease Control', key: 'is_appointed_disease_control', width: 15 },
        { header: 'EnvOcc Officer', key: 'is_appointed_envocc', width: 15 },
        { header: 'Tobacco Alcohol', key: 'is_appointed_tobacco_alcohol', width: 15 },
        
        // กฎหมาย & โลจิสติกส์
        { header: 'Law Enforcement', key: 'law_enforcement', width: 15 },
        { header: 'Regulation Drafting', key: 'law_regulation_drafting', width: 15 },
        { header: 'Logistics', key: 'logistics_experience', width: 20 },
        { header: 'Physical Fitness', key: 'physical_fitness', width: 15 },
        
        // การบริหารจัดการ
        { header: 'HR Management', key: 'management_hr', width: 15 },
        { header: 'HR Development', key: 'management_hr_development', width: 15 },
        { header: 'Procurement', key: 'procurement_emergency', width: 20 },
        
        // IT & Facility
        { header: 'IT Repair', key: 'it_computer_repair', width: 15 },
        { header: 'IT Equipment', key: 'it_equipment_management', width: 15 },
        { header: 'Vehicle', key: 'facility_vehicle_management', width: 15 },
        { header: 'Backup Site', key: 'facility_backup_site', width: 15 },
        
        // Courses (Array)
        { header: 'หลักสูตรที่ผ่าน', key: 'training_courses', width: 50 },
        { header: 'หลักสูตรโรคติดต่อนำโดยแมลง', key: 'vector_courses', width: 50 },
        { header: 'หลักสูตร EnvOcc', key: 'envocc_courses', width: 50 },
        { header: 'หลักสูตรกฎหมาย', key: 'law_courses', width: 50 },
        { header: 'ประสบการณ์อื่นๆ', key: 'other_experiences', width: 50 }
      ];

      // จัดรูปแบบ header
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };

      // เพิ่มข้อมูล - Map ครบทุกฟิลด์
      capacities.forEach(capacity => {
        worksheet.addRow({
          // ข้อมูลพื้นฐาน
          employee_id: capacity.employee_id || '',
          prefix_name: capacity.prefix_name || '',
          full_name: capacity.full_name || '',
          department: capacity.department || '',
          age: capacity.age || '',
          education_level: capacity.education_level || '',
          work_duration_years: capacity.work_duration_years || '',
          
          // ทักษะพื้นฐาน
          skill_official_writing: capacity.skill_official_writing || '',
          skill_meeting_summary: capacity.skill_meeting_summary || '',
          skill_computer_connection: capacity.skill_computer_connection || '',
          skill_communication: capacity.skill_communication || '',
          skill_epidemiology_basic: capacity.skill_epidemiology_basic || '',
          skill_excel: capacity.skill_excel || '',
          skill_presentation: capacity.skill_presentation || '',
          skill_ai_tools: capacity.skill_ai_tools || '',
          skill_english_speaking: capacity.skill_english_speaking || '',
          skill_english_writing: capacity.skill_english_writing || '',
          english_test_score: capacity.english_test_score || '',
          has_first_aid_course: capacity.has_first_aid_course || '',
          skill_first_aid: capacity.skill_first_aid || '',
          
          // ทักษะพิเศษ
          special_skills_experience: capacity.special_skills_experience || '',
          liaison_experience: capacity.liaison_experience || '',
          
          // Competency
          competency_analytical_thinking: capacity.competency_analytical_thinking || '',
          competency_information_seeking: capacity.competency_information_seeking || '',
          competency_strategic_orientation: capacity.competency_strategic_orientation || '',
          
          // ทักษะระบาดวิทยา
          epi_surveillance: capacity.epi_surveillance || '',
          epi_situation_report: capacity.epi_situation_report || '',
          epi_data_analysis: capacity.epi_data_analysis || '',
          epi_investigation_control: capacity.epi_investigation_control || '',
          epi_tool_design: capacity.epi_tool_design || '',
          epi_descriptive_analysis: capacity.epi_descriptive_analysis || '',
          epi_analytical_statistics: capacity.epi_analytical_statistics || '',
          epi_advanced_software: capacity.epi_advanced_software || '',
          epi_explain_descriptive: capacity.epi_explain_descriptive || '',
          epi_explain_analytical: capacity.epi_explain_analytical || '',
          epi_report_writing: capacity.epi_report_writing || '',
          
          // การเก็บตัวอย่าง
          sample_nasopharyngeal: capacity.sample_nasopharyngeal || '',
          sample_throat: capacity.sample_throat || '',
          sample_rectal: capacity.sample_rectal || '',
          sample_wound: capacity.sample_wound || '',
          sample_hand: capacity.sample_hand || '',
          sample_object: capacity.sample_object || '',
          sample_vomit: capacity.sample_vomit || '',
          sample_water: capacity.sample_water || '',
          sample_ice: capacity.sample_ice || '',
          sample_food: capacity.sample_food || '',
          sample_blood_finger: capacity.sample_blood_finger || '',
          sample_blood_vein: capacity.sample_blood_vein || '',
          sample_transport: capacity.sample_transport || '',
          
          // PPE & ความปลอดภัย
          ppe_standard: capacity.ppe_standard || '',
          ppe_full: capacity.ppe_full || '',
          waste_management: capacity.waste_management || '',
          zone_identification: capacity.zone_identification || '',
          shelter_area_allocation: capacity.shelter_area_allocation || '',
          shelter_organization: capacity.shelter_organization || '',
          shelter_sanitation: capacity.shelter_sanitation || '',
          
          // วิชาชีพแพทย์/พยาบาล
          has_medical_license: capacity.has_medical_license || '',
          is_practicing_medical: capacity.is_practicing_medical || '',
          screening_expertise: capacity.screening_expertise || '',
          
          // งานวัคซีน
          vaccine_work_analysis: capacity.vaccine_work_analysis || '',
          vaccine_aefi_surveillance: capacity.vaccine_aefi_surveillance || '',
          vaccine_investigation: capacity.vaccine_investigation || '',
          
          // โรคติดต่อนำโดยแมลง
          vector_diagnosis_experience: capacity.vector_diagnosis_experience || '',
          vector_field_diagnosis: capacity.vector_field_diagnosis || '',
          vector_investigation: capacity.vector_investigation || '',
          vector_control: capacity.vector_control || '',
          
          // งานด่าน
          port_sanitation: capacity.port_sanitation || '',
          port_patient_transfer: capacity.port_patient_transfer || '',
          port_law: capacity.port_law || '',
          
          // EnvOcc
          envocc_surveillance: capacity.envocc_surveillance || '',
          envocc_tools: capacity.envocc_tools || '',
          
          // Risk Communication
          risk_comm_crisis: capacity.risk_comm_crisis || '',
          risk_comm_simplify: capacity.risk_comm_simplify || '',
          risk_comm_digital: capacity.risk_comm_digital || '',
          
          // เทคนิคการแพทย์
          has_med_tech_license: capacity.has_med_tech_license || '',
          lab_experience: capacity.lab_experience || '',
          lab_specific_tasks: capacity.lab_specific_tasks || '',
          has_lab_safety_course: capacity.has_lab_safety_course || '',
          
          // การแต่งตั้ง
          is_appointed_disease_control: capacity.is_appointed_disease_control || '',
          is_appointed_envocc: capacity.is_appointed_envocc || '',
          is_appointed_tobacco_alcohol: capacity.is_appointed_tobacco_alcohol || '',
          
          // กฎหมาย & โลจิสติกส์
          law_enforcement: capacity.law_enforcement || '',
          law_regulation_drafting: capacity.law_regulation_drafting || '',
          logistics_experience: capacity.logistics_experience || '',
          physical_fitness: capacity.physical_fitness || '',
          
          // การบริหารจัดการ
          management_hr: capacity.management_hr || '',
          management_hr_development: capacity.management_hr_development || '',
          procurement_emergency: capacity.procurement_emergency || '',
          
          // IT & Facility
          it_computer_repair: capacity.it_computer_repair || '',
          it_equipment_management: capacity.it_equipment_management || '',
          facility_vehicle_management: capacity.facility_vehicle_management || '',
          facility_backup_site: capacity.facility_backup_site || '',
          
          // Courses - แปลง Array เป็น String
          training_courses: capacity.trainingCourses?.map(c => c.course_name).join(', ') || '',
          vector_courses: capacity.vectorCourses?.map(c => c.course_name).join(', ') || '',
          envocc_courses: capacity.envoccCourses?.map(c => c.course_name).join(', ') || '',
          law_courses: capacity.lawCourses?.map(c => c.course_name).join(', ') || '',
          other_experiences: capacity.otherExperiences?.map(e => e.experience_name).join(', ') || ''
        });
      });

      return workbook;
    } catch (error) {
      throw error;
    }
  }

  // Import ข้อมูลจาก Excel
  async importFromExcel(filePath) {
    const results = {
      success: 0,
      failed: 0,
      errors: []
    };

    try {
      console.log('Starting import from:', filePath);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filePath);
      const worksheet = workbook.getWorksheet(1);

      console.log('Worksheet loaded, total rows:', worksheet.rowCount);

      // อ่าน Header จาก row 1
      const headerRow = worksheet.getRow(1);
      const columnMap = {};
      
      headerRow.eachCell((cell, colNumber) => {
        const headerName = cell.value?.toString().trim();
        if (headerName) {
          columnMap[headerName] = colNumber;
        }
      });

      console.log('Column map created with', Object.keys(columnMap).length, 'columns');
      console.log('First few headers:', Object.keys(columnMap).slice(0, 10));
      
      // ตรวจสอบว่ามี column รหัสพนักงาน
      if (!columnMap['รหัสพนักงาน']) {
        throw new Error('ไม่พบคอลัมน์ "รหัสพนักงาน" ในไฟล์ Excel กรุณาตรวจสอบ Header');
      }

      let processedRows = 0;

      // อ่านข้อมูลจาก row 2 เป็นต้นไป
      for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        
        // ข้าม row ว่าง - ตรวจสอบว่า row มีข้อมูลหรือไม่
        if (!row.hasValues) {
          console.log(`Skipping row ${rowNumber} - row has no values`);
          continue;
        }
        
        // ข้าม row ว่าง
        const employeeIdCol = columnMap['รหัสพนักงาน'] || 1;
        const employeeIdValue = row.getCell(employeeIdCol).value;
        
        console.log(`Processing row ${rowNumber}, employeeId:`, employeeIdValue);
        
        if (!employeeIdValue) {
          console.log(`Skipping row ${rowNumber} - no employee ID`);
          continue;
        }

        processedRows++;

        const transaction = await sequelize.transaction();

        try {
          const employeeId = employeeIdValue.toString().trim();
          
          if (!employeeId) {
            results.failed++;
            results.errors.push(`Row ${rowNumber}: ไม่มีรหัสพนักงาน`);
            await transaction.rollback();
            continue;
          }

          // ตรวจสอบว่ามี employee อยู่จริง
          const employee = await Employee.findByPk(employeeId);
          if (!employee) {
            results.failed++;
            results.errors.push(`Row ${rowNumber}: ไม่พบพนักงานรหัส ${employeeId}`);
            await transaction.rollback();
            continue;
          }

          // Helper function เพื่ออ่านค่าจาก column
          const getCellValue = (headerName, defaultValue = null) => {
            const colNumber = columnMap[headerName];
            if (!colNumber) return defaultValue;
            const value = row.getCell(colNumber).value;
            return value !== null && value !== undefined ? value.toString().trim() : defaultValue;
          };

          // เตรียมข้อมูล - อ่านจาก header name
          const capacityData = {
            // ข้อมูลพื้นฐาน
            prefix_name: getCellValue('คำนำหน้า'),
            full_name: getCellValue('ชื่อ-นามสกุล'),
            department: getCellValue('แผนก'),
            age: getCellValue('อายุ') ? parseInt(getCellValue('อายุ')) : null,
            education_level: getCellValue('ระดับการศึกษา'),
            work_duration_years: getCellValue('ระยะเวลาปฏิบัติงาน'),
            
            // ทักษะพื้นฐาน
            skill_official_writing: getCellValue('การเขียนหนังสือราชการ'),
            skill_meeting_summary: getCellValue('การสรุปการประชุม'),
            skill_computer_connection: getCellValue('การใช้คอมพิวเตอร์'),
            skill_communication: getCellValue('การสื่อสาร'),
            skill_epidemiology_basic: getCellValue('หลักระบาดวิทยา'),
            skill_excel: getCellValue('Excel'),
            skill_presentation: getCellValue('PowerPoint'),
            skill_ai_tools: getCellValue('AI Tools'),
            skill_english_speaking: getCellValue('ภาษาอังกฤษ พูด-ฟัง'),
            skill_english_writing: getCellValue('ภาษาอังกฤษ อ่าน-เขียน'),
            english_test_score: getCellValue('คะแนนภาษาอังกฤษ'),
            has_first_aid_course: getCellValue('ผ่าน First Aid'),
            skill_first_aid: getCellValue('ทักษะ First Aid'),
            
            // ทักษะพิเศษ
            special_skills_experience: getCellValue('ทักษะ/ประสบการณ์พิเศษ'),
            liaison_experience: getCellValue('ประสบการณ์ Liaison'),
            
            // Competency
            competency_analytical_thinking: getCellValue('Analytical Thinking'),
            competency_information_seeking: getCellValue('Information Seeking'),
            competency_strategic_orientation: getCellValue('Strategic Orientation'),
            
            // ทักษะระบาดวิทยา
            epi_surveillance: getCellValue('เฝ้าระวังโรค'),
            epi_situation_report: getCellValue('รายงานสถานการณ์'),
            epi_data_analysis: getCellValue('วิเคราะห์ข้อมูล'),
            epi_investigation_control: getCellValue('สอบสวนควบคุมโรค'),
            epi_tool_design: getCellValue('ออกแบบเครื่องมือ'),
            epi_descriptive_analysis: getCellValue('วิเคราะห์เชิงพรรณนา'),
            epi_analytical_statistics: getCellValue('วิเคราะห์เชิงวิเคราะห์'),
            epi_advanced_software: getCellValue('โปรแกรมขั้นสูง'),
            epi_explain_descriptive: getCellValue('อธิบายเชิงพรรณนา'),
            epi_explain_analytical: getCellValue('อธิบายเชิงวิเคราะห์'),
            epi_report_writing: getCellValue('เขียนรายงาน'),
            
            // การเก็บตัวอย่าง
            sample_nasopharyngeal: getCellValue('Nasopharyngeal'),
            sample_throat: getCellValue('Throat'),
            sample_rectal: getCellValue('Rectal'),
            sample_wound: getCellValue('Wound'),
            sample_hand: getCellValue('Hand'),
            sample_object: getCellValue('Object'),
            sample_vomit: getCellValue('Vomit'),
            sample_water: getCellValue('Water'),
            sample_ice: getCellValue('Ice'),
            sample_food: getCellValue('Food'),
            sample_blood_finger: getCellValue('Blood Finger'),
            sample_blood_vein: getCellValue('Blood Vein'),
            sample_transport: getCellValue('Transport'),
            
            // PPE & ความปลอดภัย
            ppe_standard: getCellValue('PPE Standard'),
            ppe_full: getCellValue('PPE Full'),
            waste_management: getCellValue('Waste Management'),
            zone_identification: getCellValue('Zone ID'),
            shelter_area_allocation: getCellValue('Shelter Area'),
            shelter_organization: getCellValue('Shelter Org'),
            shelter_sanitation: getCellValue('Shelter Sanitation'),
            
            // วิชาชีพแพทย์/พยาบาล
            has_medical_license: getCellValue('Medical License'),
            is_practicing_medical: getCellValue('Practicing'),
            screening_expertise: getCellValue('Screening'),
            
            // งานวัคซีน
            vaccine_work_analysis: getCellValue('Vaccine Analysis'),
            vaccine_aefi_surveillance: getCellValue('AEFI Surveillance'),
            vaccine_investigation: getCellValue('Vaccine Investigation'),
            
            // โรคติดต่อนำโดยแมลง
            vector_diagnosis_experience: getCellValue('Vector Diagnosis'),
            vector_field_diagnosis: getCellValue('Vector Field'),
            vector_investigation: getCellValue('Vector Investigation'),
            vector_control: getCellValue('Vector Control'),
            
            // งานด่าน
            port_sanitation: getCellValue('Port Sanitation'),
            port_patient_transfer: getCellValue('Port Transfer'),
            port_law: getCellValue('Port Law'),
            
            // EnvOcc
            envocc_surveillance: getCellValue('EnvOcc Surveillance'),
            envocc_tools: getCellValue('EnvOcc Tools'),
            
            // Risk Communication
            risk_comm_crisis: getCellValue('Crisis Comm'),
            risk_comm_simplify: getCellValue('Simplify Comm'),
            risk_comm_digital: getCellValue('Digital Comm'),
            
            // เทคนิคการแพทย์
            has_med_tech_license: getCellValue('Med Tech License'),
            lab_experience: getCellValue('Lab Experience'),
            lab_specific_tasks: getCellValue('Lab Tasks'),
            has_lab_safety_course: getCellValue('Lab Safety'),
            
            // การแต่งตั้ง
            is_appointed_disease_control: getCellValue('Disease Control'),
            is_appointed_envocc: getCellValue('EnvOcc Officer'),
            is_appointed_tobacco_alcohol: getCellValue('Tobacco Alcohol'),
            
            // กฎหมาย & โลจิสติกส์
            law_enforcement: getCellValue('Law Enforcement'),
            law_regulation_drafting: getCellValue('Regulation Drafting'),
            logistics_experience: getCellValue('Logistics'),
            physical_fitness: getCellValue('Physical Fitness'),
            
            // การบริหารจัดการ
            management_hr: getCellValue('HR Management'),
            management_hr_development: getCellValue('HR Development'),
            procurement_emergency: getCellValue('Procurement'),
            
            // IT & Facility
            it_computer_repair: getCellValue('IT Repair'),
            it_equipment_management: getCellValue('IT Equipment'),
            facility_vehicle_management: getCellValue('Vehicle'),
            facility_backup_site: getCellValue('Backup Site')
          };

          // แปลง array fields (แยกด้วย comma)
          const trainingCoursesStr = getCellValue('หลักสูตรที่ผ่าน', '');
          const vectorCoursesStr = getCellValue('หลักสูตรโรคติดต่อนำโดยแมลง', '');
          const envoccCoursesStr = getCellValue('หลักสูตร EnvOcc', '');
          const lawCoursesStr = getCellValue('หลักสูตรกฎหมาย', '');
          const otherExperiencesStr = getCellValue('ประสบการณ์อื่นๆ', '');

          capacityData.trainingCourses = trainingCoursesStr ? 
            trainingCoursesStr.split(',').map(s => s.trim()).filter(s => s) : [];
          capacityData.vectorCourses = vectorCoursesStr ? 
            vectorCoursesStr.split(',').map(s => s.trim()).filter(s => s) : [];
          capacityData.envoccCourses = envoccCoursesStr ? 
            envoccCoursesStr.split(',').map(s => s.trim()).filter(s => s) : [];
          capacityData.lawCourses = lawCoursesStr ? 
            lawCoursesStr.split(',').map(s => s.trim()).filter(s => s) : [];
          capacityData.otherExperiences = otherExperiencesStr ? 
            otherExperiencesStr.split(',').map(s => s.trim()).filter(s => s) : [];

          // บันทึกข้อมูล
          console.log(`Saving capacity for employee ${employeeId}...`);
          await this.createOrUpdateCapacity(employeeId, capacityData);
          await transaction.commit();
          results.success++;
          console.log(`Successfully imported row ${rowNumber} for employee ${employeeId}`);

        } catch (error) {
          await transaction.rollback();
          results.failed++;
          results.errors.push(`Row ${rowNumber}: ${error.message}`);
          console.error(`Import error at row ${rowNumber}:`, error.message);
        }
      }

      console.log('Import results:', results);
      console.log(`Processed ${processedRows} rows with data`);
      
      if (processedRows === 0) {
        console.warn('Warning: No rows were processed. Check if Excel file has data starting from row 2.');
      }
      
      return results;

    } catch (error) {
      console.error('Import Excel error:', error);
      throw error;
    }
  }
}

module.exports = new CapacityService();
