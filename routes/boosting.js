const express = require('express');
const router = express.Router();
const boostingController = require('../controllers/boosting');
const checkAuth = require('../middleware/check_auth');

// CRUD Routes for Boosting Plans
router.post('/plans', checkAuth, boostingController.createBoostingPlan);
router.get('/plans', checkAuth, boostingController.getBoostingPlans);
router.put('/plans/:id', checkAuth, boostingController.updateBoostingPlan);
router.delete('/plans/:id', checkAuth, boostingController.deleteBoostingPlan);

// Boosting Actions
router.post('/buyPlan', checkAuth, boostingController.buyBoostingPlan);
router.post('/allow', checkAuth, boostingController.allowBoosting);
router.post('/claim', checkAuth, boostingController.claimBoosting);

module.exports = router;
