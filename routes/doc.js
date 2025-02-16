const express = require("express");
const docCtrl = require('../controllers/doc');

const router = express.Router();

router.get('', docCtrl.getDocumentUrls);
router.put('', docCtrl.updateDocumentUrls);

module.exports = router;