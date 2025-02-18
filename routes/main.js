const express = require('express');
const router = express.Router();
const authRouter = require('./auth')
const docRouter = require('./doc')
const versionRouter = require('./version')
const wallpaperRouter = require('./wallpaper')
const notificationRouter = require('./notification')
const imageRouter = require('./image')

router.use('/auth', authRouter)
router.use('/doc', docRouter)
router.use('/version', versionRouter)
router.use('/wallpaper', wallpaperRouter)
router.use('/notification', notificationRouter)
router.use('/image', imageRouter)

module.exports = router;

// sequelize model:generate --name Category --attributes appName:String,author:String,categoryName:String
// sequelize db:migrate