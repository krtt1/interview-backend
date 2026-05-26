const express = require('express');
const router = express.Router();
const commandController = require('../controllers/commandController');
const { authenticate, authorize } = require('../middleware/auth');
const uploadCommand = require('../middleware/uploadCommand');

// CREATE
router.post('/create', authenticate, authorize('admin', 'superadmin'), commandController.create);

// EXPORT
router.get('/export-excel', authenticate, authorize('admin', 'superadmin'), commandController.exportCommandsExcel);
router.get('/export-command-employees', authenticate, authorize('admin', 'superadmin'), commandController.exportCommandEmployeesExcel);

//  EMPLOYEE-SPECIFIC 
router.put('/:command_id/employee/:employee_id',authenticate,authorize('admin', 'superadmin'),commandController.updateEmployeeJob);

// UPLOAD DOWNLOAD FILE
router.post('/:command_id/upload/:employee_id', authenticate, authorize('admin', 'superadmin'), uploadCommand.single('file'), commandController.uploadFile);
router.get('/:command_id/download/:employee_id', authenticate, commandController.downloadFile);

// GET
router.get('/getall', authenticate, commandController.getAll);
router.get('/:id', authenticate, commandController.getById);

// UPDATE COMMAND (ADMIN)
router.put('/:id', authenticate, authorize('admin', 'superadmin'), commandController.update);

// DELETE COMMAND (ADMIN)
router.delete('/:id', authenticate, authorize('admin', 'superadmin'), commandController.delete);

module.exports = router;
