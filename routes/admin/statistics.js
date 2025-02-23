const express = require("express");
const statisticsCtrl = require('../../controllers/admin/statistics');
const checkAuth = require('../../middleware/check_auth');

const router = express.Router();

router.get('', checkAuth, statisticsCtrl.getUserStatistics);

module.exports = router;