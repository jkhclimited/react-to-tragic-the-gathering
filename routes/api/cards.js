const express = require('express');
const router = express.Router();
const cardCtrl = require('../../controllers/api/cards');

router.use(require('../../config/auth'));
router.post('/', cardCtrl.create);
router.get('/', cardCtrl.index);
router.put('/', cardCtrl.update);
router.get('/:id', cardCtrl.getOne);
router.delete('/:id', cardCtrl.delete);
router.put('/:id', cardCtrl.updatePrint);

module.exports = router;