const express = require('express');
const router = express.Router();
const jobGroupController = require('../controllers/jobGroupController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/create', authenticate, authorize('admin'), jobGroupController.create);
router.get('/getall', authenticate, authorize('admin', 'user'), jobGroupController.getAll);
router.get('/public/getall', jobGroupController.getAll);
router.get('/:id', authenticate, authorize('admin', 'user'), jobGroupController.getById);
router.put('/:id', authenticate, authorize('admin'), jobGroupController.update);
router.delete('/:id', authenticate, authorize('admin'), jobGroupController.delete);

module.exports = router;
