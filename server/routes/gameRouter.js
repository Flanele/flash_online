const router = require('express').Router();
const gameController = require('../controllers/gameController');

router.post('/', gameController.addGame);
router.get('/', gameController.getAll);
router.get('/:id', gameController.getOne);

module.exports = router;