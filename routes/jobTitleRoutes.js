const express = require('express');
const router = express.Router();
const jobTitleController = require('../controllers/jobTitleController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/create', authenticate, authorize('admin'), jobTitleController.create);
router.get('/getall', authenticate, authorize('admin', 'user'), jobTitleController.getAll);
router.get('/public/getall', jobTitleController.getAll);
router.get('/:id', authenticate, authorize('admin', 'user'), jobTitleController.getById);
router.put('/:id', authenticate, authorize('admin'), jobTitleController.update);
router.delete('/:id', authenticate, authorize('admin'), jobTitleController.delete);

module.exports = router;
