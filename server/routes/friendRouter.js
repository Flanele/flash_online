const friendController = require('../controllers/friendController');
const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router();

router.get('/', authMiddleware, friendController.getFriendsList);
router.get('/search/', authMiddleware, friendController.searchFriends);
router.post('/:friendId', authMiddleware, friendController.addFriend);
router.patch('/:friendId', authMiddleware, friendController.acceptFriendRequest);
router.delete('/:friendId', authMiddleware, friendController.removeFriendOrDeclineRequest);

module.exports = router;