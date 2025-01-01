const router = require('express').Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, notificationController.getAllNotifications);
router.patch('/:id', authMiddleware, notificationController.markAsSeen);

module.exports = router; 