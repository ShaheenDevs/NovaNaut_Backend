const express = require("express");
const miningCtrl = require("../controllers/mining");
const checkAuth = require("../middleware/check_auth");

const router = express.Router();

router.post("/manage-mining", checkAuth, miningCtrl.manageMining);
router.post("/upgrade", checkAuth, miningCtrl.upgradeMiningLevel);

module.exports = router;
