const express = require("express");
const wallpaperCtrl = require('../controllers/wallpaper');
const checkAuth = require('../middleware/check_auth');

const router = express.Router();

router.post('', checkAuth, wallpaperCtrl.addWallpaper);
router.get('', checkAuth, wallpaperCtrl.getWallpaper);
router.delete('/:id', checkAuth, wallpaperCtrl.deleteWallpaper);
router.put('/:id', checkAuth, wallpaperCtrl.updateWallpaper);

module.exports = router;