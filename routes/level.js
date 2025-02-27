const express = require("express");
const levelCtrl = require('../controllers/level');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.post('/createLevel', levelCtrl.createLevel);
router.get('/getLevels', levelCtrl.getLevels);
router.put('/updateLevel/:id', checkAuth, levelCtrl.updateLevel);
router.delete('/deleteLevel/:id', checkAuth, levelCtrl.deleteLevel);

module.exports = router;