const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router();

router.get('/', authMiddleware, notificationController.getAllNotifications);
router.patch('/:id', authMiddleware, notificationController.markAsSeen);

module.exports = router; 