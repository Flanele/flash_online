const router = require('express').Router();
const genreController = require('../controllers/genreController');

router.post('/', genreController.addGenre);
router.get('/', genreController.getAll);

module.exports = router;