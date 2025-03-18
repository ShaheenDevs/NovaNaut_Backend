const express = require("express");
const authCtrl = require('../controllers/auth');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.post('/signIn', authCtrl.signIn);
router.post('/signUp', authCtrl.signUp);
router.delete('/delUser/:id', checkAuth, authCtrl.delUser);
router.post('/updateVerification', authCtrl.updateVerification);
router.put('/updateProfile', checkAuth, authCtrl.updateProfile);

module.exports = router;