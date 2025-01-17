const router = require('express').Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:receiverId', authMiddleware, messageController.getAllMessagesWithUser);
router.get('/', authMiddleware, messageController.getMessages);
router.get('/unread/:senderId', authMiddleware, messageController.getUnreadMessagesByUser);
router.patch('/:id', authMiddleware, messageController.markMessageAsRead);
router.put('/:id', authMiddleware, messageController.editMessage);
router.post('/:receiverId', authMiddleware, messageController.createMessage);
router.delete('/:id', authMiddleware, messageController.deleteMessage);


module.exports = router; 