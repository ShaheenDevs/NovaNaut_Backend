const express = require("express");
const usersCtrl = require('../../controllers/admin/users');
const checkAuth = require('../../middleware/check_auth');

const router = express.Router();

router.get('', checkAuth, usersCtrl.getAllUsers);

module.exports = router;