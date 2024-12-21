const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = require('express').Router();

router.get('/', authMiddleware, favoriteController.getAllFavorites);
router.post('/:id', authMiddleware, favoriteController.addGameToFavorites);
router.delete('/:id', authMiddleware, favoriteController.removeGameFromFavorites);
router.get('/:id', authMiddleware, favoriteController.checkIsGameFavorite);

module.exports = router;