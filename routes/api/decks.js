const express = require('express');
const router = express.Router();
const decksCtrl = require('../../controllers/api/decks');

router.use(require('../../config/auth'));
router.get('/', decksCtrl.index);
router.post('/', decksCtrl.create);
router.get('/:id', decksCtrl.decklist);
router.delete('/:id', decksCtrl.delete);
router.post('/addcard', decksCtrl.addCard);

module.exports = router;