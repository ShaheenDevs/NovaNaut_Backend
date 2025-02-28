const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check_auth');
const { getLeaderboard, getUserRank } = require('../controllers/leaderboard');

router.get('/getLeaderboard', checkAuth, getLeaderboard);
router.get('/getUserRank/:userId', checkAuth, getUserRank);

module.exports = router;
