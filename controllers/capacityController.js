const capacityService = require('../services/capacityService');

class CapacityController {
  // สร้างหรืออัปเดตข้อมูลสมรรถนะ
  async createOrUpdate(req, res) {
    try {
      const { id: employeeId } = req.params;
      const capacityData = req.body;

      const capacity = await capacityService.createOrUpdateCapacity(employeeId, capacityData);

      res.status(200).json({
        message: 'บันทึกข้อมูลสมรรถนะสำเร็จ',
        data: capacity
      });
    } catch (error) {
      console.error('Error in createOrUpdate:', error);
      res.status(400).json({ message: error.message });
    }
  }

  // ดึงข้อมูลสมรรถนะตาม employee_id
  async getByEmployeeId(req, res) {
    try {
      const { id: employeeId } = req.params;

      const capacity = await capacityService.getCapacityByEmployeeId(employeeId);

      if (!capacity) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลสมรรถนะ' });
      }

      res.status(200).json({
        message: 'ดึงข้อมูลสมรรถนะสำเร็จ',
        data: capacity
      });
    } catch (error) {
      console.error('Error in getByEmployeeId:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // ดึงข้อมูลสมรรถนะทั้งหมด
  async getAll(req, res) {
    try {
      const capacities = await capacityService.getAllCapacities();

      res.status(200).json({
        message: 'ดึงข้อมูลสมรรถนะทั้งหมดสำเร็จ',
        total: capacities.length,
        data: capacities
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // ลบข้อมูลสมรรถนะ
  async delete(req, res) {
    try {
      const { id: employeeId } = req.params;

      const result = await capacityService.deleteCapacity(employeeId);

      res.status(200).json(result);
    } catch (error) {
      console.error('Error in delete:', error);
      res.status(400).json({ message: error.message });
    }
  }

  // Export ข้อมูลเป็น Excel
  async exportExcel(req, res) {
    try {
      const workbook = await capacityService.exportToExcel();

      // ตั้งชื่อไฟล์
      const filename = `capacity_export_${new Date().toISOString().split('T')[0]}.xlsx`;

      // ตั้งค่า response headers
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // ส่งไฟล์
      await workbook.xlsx.write(res);
      res.end();

    } catch (error) {
      console.error('Error in exportExcel:', error);
      res.status(500).json({ message: error.message });
    }
  }

  // Import ข้อมูลจาก Excel
  async importExcel(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'กรุณาอัปโหลดไฟล์ Excel' });
      }

      const results = await capacityService.importFromExcel(req.file.path);

      // ลบไฟล์หลังจาก import เสร็จ
      const fs = require('fs');
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(200).json({
        success: true,
        message: 'Import ข้อมูลเสร็จสิ้น',
        imported: results.success,
        failed: results.failed,
        total: results.success + results.failed,
        errors: results.errors
      });

    } catch (error) {
      console.error('Error in importExcel:', error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CapacityController();
