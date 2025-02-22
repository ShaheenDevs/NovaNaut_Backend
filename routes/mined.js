const express = require("express");
const minedCtrl = require('../controllers/mined');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.get('', minedCtrl.getMineTokens);
router.put('', checkAuth, minedCtrl.updateMineAbleTokens);

module.exports = router;