const express = require("express");
const { addKYC, verifyKYC, getKYCStatus, getAllKYCStatus } = require("../controllers/kyc");
const router = express.Router();
const checkAuth = require('../middleware/check_auth');

router.post("/add", checkAuth, addKYC);
router.post("/verify", checkAuth, verifyKYC);
router.get("/status", checkAuth, getKYCStatus);
router.get("/getAllStatus", checkAuth, getAllKYCStatus);

module.exports = router;