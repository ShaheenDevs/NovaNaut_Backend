const express = require("express");
const docCtrl = require('../controllers/doc');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.get('', checkAuth, docCtrl.getDocumentUrls);
router.put('', checkAuth, docCtrl.updateDocumentUrls);

module.exports = router;