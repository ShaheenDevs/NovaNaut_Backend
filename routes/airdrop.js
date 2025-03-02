const express = require("express");
const router = express.Router();
const airdropCtrl = require("../controllers/airdrop");
const checkAuth = require('../middleware/check_auth');

// Assign airdrop
router.post("/assign", checkAuth, airdropCtrl.assignAirdrop);

// Get airdrop details for all user
router.get("", checkAuth, airdropCtrl.getAirdrops);

// Claim airdrop
router.put("/claim/:airdropId", checkAuth, airdropCtrl.claimAirdrop);

// Delete airdrop entry
router.delete("/:airdropId", checkAuth, airdropCtrl.deleteAirdrop);

module.exports = router;
