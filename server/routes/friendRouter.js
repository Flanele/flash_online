const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router();

router.get('/', authMiddleware, friendController.getFriendsList);
router.post('/:friendId', authMiddleware, friendController.addFriend);
router.patch('/:friendId', authMiddleware, friendController.acceptFriendRequest);
router.delete('/:friendId', authMiddleware, friendController.declineFriendRequest);

module.exports = router;