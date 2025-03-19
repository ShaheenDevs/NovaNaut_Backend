const models = require("../models");
const cron = require('node-cron');
const { Op } = require('sequelize');

const manageMining = async (req, res) => {
    try {
        const { userId } = req.userData;
        let user = await models.User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        // ✅ Check for active boosting plan
        let boostingPlan = null;
        if (user.boostingExpiryDate && new Date(user.boostingExpiryDate) > new Date()) {
            boostingPlan = await models.BoostingPlan.findByPk(user.boostingPlanId);
        }

        const currentTime = new Date();
        let elapsedHours = 0;
        let minedAmount = 0;
        let miningActive = false;
        const miningRate = (user.miningLevel * 0.02) + (boostingPlan?.power ?? 0);

        if (user.miningStartTime) {
            elapsedHours = (currentTime - new Date(user.miningStartTime)) / (1000 * 60 * 60);
            miningActive = elapsedHours < 24;

            if (miningActive) {
                minedAmount = parseFloat((elapsedHours * miningRate).toFixed(2));

                // Update balance
                user.balance += minedAmount;
                await user.save();

                // Calculate timeLeft correctly (HH:MM format)
                const remainingHours = Math.floor(24 - elapsedHours);
                const remainingMinutes = Math.floor((24 - elapsedHours - remainingHours) * 60);
                const timeLeft = `${remainingHours}:${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}`;

                return res.json({
                    message: "Mining active, rewards claimed",
                    miningActive: true,
                    minedAmount,
                    balance: user.balance,
                    timeLeft, // Proper HH:MM format
                    timePercentage: ((elapsedHours / 24) * 100).toFixed(2),
                    miningRate,
                    miningStartTime: user.miningStartTime,
                });
            }
        }

        // If mining exceeded 24 hours, cap rewards at 24 hours and restart
        minedAmount = parseFloat((24 * miningRate).toFixed(2));
        await models.sequelize.transaction(async (t) => {
            user.balance += minedAmount;
            user.miningStartTime = new Date(); // Restart mining
            await user.save({ transaction: t });
        });

        return res.json({
            message: "Mining session expired, rewards claimed and restarted",
            miningActive: true,
            minedAmount,
            balance: user.balance,
            timeLeft: "00:00",
            timePercentage: "0",
            miningRate,
            miningStartTime: user.miningStartTime,
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

const checkMiningStatus = async (req, res) => {
    try {
        const { userId } = req.userData;
        let user = await models.User.findByPk(userId);

        if (!user) return res.status(404).json({ error: "User not found" });
        const airdrop = await models.Airdrop.findOne({ where: { userId: user.id, status: "pending" } });

        // ✅ Check for active boosting plan
        let boostingPlan = null;
        if (user.boostingExpiryDate && new Date(user.boostingExpiryDate) > new Date()) {
            boostingPlan = await models.BoostingPlan.findByPk(user.boostingPlanId);
        }
        allowBoostingClime = false;

        // Check if boosting is already pending
        if (user.boostingPlanId != null && user.boostingExpiryDate === null) {
            allowBoostingClime = true;
        }

        const currentTime = new Date();
        let elapsedHours = 0;
        let minedAmount = 0;
        let miningActive = false;
        const miningRate = (user.miningLevel * 0.02) + (boostingPlan?.power ?? 0);
        const kyc = await models.KYC.findOne({ where: { userId: user.id }, attributes: ['status', 'rejectionReason'] });

        if (user.miningStartTime) {
            elapsedHours = (currentTime - new Date(user.miningStartTime)) / (1000 * 60 * 60);
            miningActive = elapsedHours < 24;

            if (miningActive) {
                minedAmount = parseFloat((elapsedHours * miningRate).toFixed(2));

                // Calculate timeLeft correctly (HH:MM format)
                const remainingHours = Math.floor(24 - elapsedHours);
                const remainingMinutes = Math.floor((24 - elapsedHours - remainingHours) * 60);
                const timeLeft = `${remainingHours}:${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}`;

                return res.json({
                    message: "Mining active, status checked",
                    data: {
                        miningActive: true,
                        minedAmount,
                        balance: user.balance + minedAmount,
                        timeLeft, // Proper HH:MM format
                        timePercentage: ((elapsedHours / 24) * 100).toFixed(2),
                        miningRate,
                        miningStartTime: user.miningStartTime,
                        miningLevel: user.miningLevel,
                        allowBoostingClime,
                        boostingPlanId: user.boostingPlanId,
                        kyc,
                        boostingPlan,
                        airdrop,
                    }

                });
            }
        }

        return res.json({
            message: "Mining session expired, status checked",
            data: {
                miningActive: false,
                minedAmount: parseFloat((24 * miningRate).toFixed(2)),
                balance: user.balance + minedAmount,
                timeLeft: "00:00",
                timePercentage: "0",
                miningRate,
                miningStartTime: user.miningStartTime,
                miningLevel: user.miningLevel,
                allowBoostingClime,
                boostingPlanId: user.boostingPlanId,
                kyc,
                boostingPlan,
                airdrop,
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Upgrade Mining Level
const upgradeMiningLevelForActiveUsers = async () => {
    try {
        const fiveDaysAgo = new Date();
        fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

        const activeUsers = await models.User.findAll({
            where: { updatedAt: { [Op.gte]: fiveDaysAgo } }
        });

        for (const user of activeUsers) {
            const invitationCount = await models.Invitation.count({
                where: { reReferralBy: user.id, status: "accepted" }
            });

            let targetLevel = 1; // Default starting level
            if (invitationCount >= 10) targetLevel = 1;
            if (invitationCount >= 20) targetLevel = 2;
            if (invitationCount >= 30) targetLevel = 3;
            if (invitationCount >= 40) targetLevel = 4;
            if (invitationCount >= 50) targetLevel = 5;
            if (invitationCount >= 60) targetLevel = 6;

            if (user.miningLevel !== targetLevel) {
                await models.User.update(
                    { miningLevel: targetLevel },
                    { where: { id: user.id } }
                );
                console.log(`User ID ${user.id} upgraded to level ${targetLevel}`);
            }
        }

        console.log("Mining level upgrade cron job completed successfully.");
    } catch (error) {
        console.error("Error in upgradeMiningLevelForActiveUsers:", error.message);
    }
};

// Run cron job every day at 1 AM
cron.schedule('0 1 * * *', upgradeMiningLevelForActiveUsers);

console.log("✅ Cron job scheduled: Running every day at 1 AM.");


module.exports = {
    manageMining,
    checkMiningStatus,
};
