const express = require('express');
const router = express.Router();
const positionLevelController = require('../controllers/positionLevelController');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/create', authenticate, authorize('admin'), positionLevelController.create);
router.get('/getall', authenticate, authorize('admin', 'user'), positionLevelController.getAll);
router.get('/public/getall', positionLevelController.getAll);
router.get('/:id', authenticate, authorize('admin', 'user'), positionLevelController.getById);
router.put('/:id', authenticate, authorize('admin'), positionLevelController.update);
router.delete('/:id', authenticate, authorize('admin'), positionLevelController.delete);

module.exports = router;
