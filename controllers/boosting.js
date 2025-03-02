const models = require('../models');
const { Op } = require('sequelize');

// 🎯 Create Boosting Plan
const createBoostingPlan = async (req, res) => {
    try {
        const { name, durationDays, price, power } = req.body;
        const plan = await models.BoostingPlan.create({ name, durationDays, price, power });

        res.status(201).json({ status: 201, message: "Boosting plan created", data: plan });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error creating plan", error: error.message });
    }
};

// 🎯 Get All Boosting Plans (with pagination)
const getBoostingPlans = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * parseInt(limit);

        // Fetch Boosting Plans with Pagination
        const { count, rows: plans } = await models.BoostingPlan.findAndCountAll({
            limit: parseInt(limit),
            offset: offset,
            order: [["createdAt", "DESC"]], // Sort by latest boosting plans
        });

        if (!plans.length) {
            return res.status(404).json({ message: "No boosting plans found" });
        }

        res.json({
            status: 200,
            totalPlans: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            plans,
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error fetching boosting plans", error: error.message });
    }
};


// 🎯 Update Boosting Plan
const updateBoostingPlan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, durationDays, price, power } = req.body;

        const plan = await models.BoostingPlan.findByPk(id);
        if (!plan) return res.status(404).json({ status: 404, message: "Plan not found" });

        await plan.update({ name, durationDays, price, power });

        res.json({ status: 200, message: "Boosting plan updated", data: plan });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error updating plan", error: error.message });
    }
};

// 🎯 Delete Boosting Plan
const deleteBoostingPlan = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await models.BoostingPlan.findByPk(id);
        if (!plan) return res.status(404).json({ status: 404, message: "Plan not found" });

        await plan.destroy();
        res.json({ status: 200, message: "Boosting plan deleted" });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error deleting plan", error: error.message });
    }
};

const allowBoosting = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        // Check if user exists
        const user = await models.User.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        // Check if plan exists
        const plan = await models.BoostingPlan.findByPk(planId);
        if (!plan) {
            return res.status(404).json({ status: 404, message: "Boosting plan not found" });
        }

        // Check if boosting is already pending
        if (user.boostingPlanId === planId && user.boostingExpiryDate === null) {
            return res.status(400).json({ status: 400, message: "Boosting is already pending approval" });
        }

        // Update user boosting details (set boostingExpiryDate to null, assign planId)
        await user.update({
            boostingExpiryDate: null,
            boostingPlanId: planId
        });

        res.status(200).json({ status: 200, message: "Boosting activated successfully", data: user });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error activating boosting", error: error.message });
    }
};

// 🎯 Claim Boosting API
const claimBoosting = async (req, res) => {
    try {
        const { userId } = req.userData;
        const { planId } = req.body;

        const user = await models.User.findOne({ where: { id: userId } });

        if (!user) {
            return res.status(400).json({ status: 400, message: "Boosting is not active or expired" });
        }

        const plan = await models.BoostingPlan.findByPk(planId);
        if (!plan) {
            return res.status(404).json({ status: 404, message: "Plan not found" });
        }

        if (user.boostingPlanId === plan.id && user.boostingExpiryDate !== null) {
            return res.status(400).json({ status: 400, message: "Already Claimed" });
        }

        let boostingExpiryDate = new Date();
        boostingExpiryDate.setDate(boostingExpiryDate.getDate() + plan.durationDays);

        // Update both boostingPlanId and boostingExpiryDate
        await user.update({ boostingPlanId: plan.id, boostingExpiryDate });

        res.status(200).json({ status: 200, message: "Boosting claimed successfully", data: user });
    } catch (error) {
        res.status(500).json({ status: 500, message: "Error claiming boosting", error: error.message });
    }
};

const buyBoostingPlan = async (req, res) => {
    try {
        const { userId, planId, paymentMethod, transactionId } = req.body;

        if (!userId || !planId || !paymentMethod || !transactionId) {
            return res.status(400).json({ status: 400, message: "User ID, Plan ID, Payment Method, and Transaction ID are required" });
        }

        const user = await models.User.findByPk(userId);
        if (!user) return res.status(404).json({ status: 404, message: "User not found" });

        const plan = await models.BoostingPlan.findByPk(planId);
        if (!plan) return res.status(404).json({ status: 404, message: "Plan not found" });

        if (user.boostingPlanId === plan.id && user.boostingExpiryDate && new Date(user.boostingExpiryDate) > new Date()) {
            return res.status(400).json({ status: 400, message: "You already have this active plan" });
        }

        // Save Payment Record
        const payment = await models.Payment.create({
            userId,
            planId,
            amount: plan.price,
            paymentMethod,
            transactionId,
            status: "success"
        });

        // Calculate boosting expiry date
        let boostingExpiryDate = new Date();
        boostingExpiryDate.setDate(boostingExpiryDate.getDate() + plan.durationDays);

        // Update user's plan details
        await user.update({ boostingPlanId: plan.id, boostingExpiryDate });

        res.status(200).json({
            status: 200,
            message: "Plan purchased successfully",
            data: { user, plan, payment }
        });

    } catch (error) {
        res.status(500).json({ status: 500, message: "Error purchasing plan", error: error.message });
    }
};


module.exports = {
    createBoostingPlan,
    getBoostingPlans,
    updateBoostingPlan,
    deleteBoostingPlan,
    allowBoosting,
    claimBoosting,
    buyBoostingPlan,
};
