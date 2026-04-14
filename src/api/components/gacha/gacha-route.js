const express = require('express');

const router = express.Router();
const gachaController = require('./gacha-controller');

router.post('/roll', gachaController.roll);
router.get('/history', gachaController.getHistory);
router.get('/inventory', gachaController.getInventory);
router.get('/winners', gachaController.getWinnersList);

module.exports = router;
