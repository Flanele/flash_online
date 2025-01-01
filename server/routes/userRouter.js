const router = require('express').Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);

router.post('/login', userController.login);

router.get('/auth', authMiddleware, userController.check);

router.patch('/', authMiddleware, userController.editUser);

router.get('/', authMiddleware, userController.getAllUsers);

module.exports = router; 