const express = require('express');
const router = express.Router();
const authRouter = require('./auth')
const docRouter = require('./doc')
const versionRouter = require('./version')
const wallpaperRouter = require('./wallpaper')
const notificationRouter = require('./notification')
const minedRouter = require('./mined')
const messageRouter = require('./message')
const invitationRouter = require('./invitation')
const miningRouter = require('./mining')
const levelRouter = require('./level')
const leaderboardRouter = require('./leaderboard')
const airdropRouter = require('./airdrop')
const boostingRouter = require('./boosting')
const kycRouter = require('./kyc')
const statisticsRouter = require('./admin/statistics')
const usersRouter = require('./admin/users')
const imageRouter = require('./image')

router.use('/auth', authRouter)
router.use('/doc', docRouter)
router.use('/version', versionRouter)
router.use('/wallpaper', wallpaperRouter)
router.use('/notification', notificationRouter)
router.use('/mined', minedRouter)
router.use('/message', messageRouter)
router.use('/invitation', invitationRouter)
router.use('/mining', miningRouter)
router.use('/level', levelRouter)
router.use('/leaderboard', leaderboardRouter)
router.use('/airdrop', airdropRouter)
router.use('/boosting', boostingRouter)
router.use('/kyc', kycRouter)
router.use('/statistics', statisticsRouter)
router.use('/users', usersRouter)
router.use('/image', imageRouter)

module.exports = router;

// sequelize model:generate --name Category --attributes appName:String,author:String,categoryName:String
// sequelize db:migrate