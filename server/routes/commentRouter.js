const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');


const router = require('express').Router();

router.post('/:id', authMiddleware, commentController.addNewComment);
router.get('/:id', commentController.getAllComments);

module.exports = router;