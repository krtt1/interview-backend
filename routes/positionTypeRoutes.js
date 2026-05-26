const express = require('express');
const router = express.Router();
const positionTypeController = require('../controllers/positionTypeController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/create', authenticate, authorize('admin'), positionTypeController.create);
router.get('/getall', authenticate, authorize('admin', 'user'), positionTypeController.getAll);
router.get('/public/getall', positionTypeController.getAll);
router.get('/:id', authenticate, authorize('admin', 'user'), positionTypeController.getById);
router.put('/:id', authenticate, authorize('admin'), positionTypeController.update);
router.delete('/:id', authenticate, authorize('admin'), positionTypeController.delete);

module.exports = router;
