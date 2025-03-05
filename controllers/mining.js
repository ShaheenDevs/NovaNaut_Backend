const models = require("../models");

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
                        balance: user.balance,
                        timeLeft, // Proper HH:MM format
                        timePercentage: ((elapsedHours / 24) * 100).toFixed(2),
                        miningRate,
                        miningStartTime: user.miningStartTime,
                        miningLevel: user.miningLevel,
                        airdrop,
                        allowBoostingClime,
                        boostingPlanId: user.boostingPlanId,
                        boostingPlan,
                    }

                });
            }
        }

        return res.json({
            message: "Mining session expired, status checked",
            data: {
                miningActive: false,
                minedAmount: parseFloat((24 * miningRate).toFixed(2)),
                balance: user.balance,
                timeLeft: "00:00",
                timePercentage: "0",
                miningRate,
                miningStartTime: user.miningStartTime,
                miningLevel: user.miningLevel,
                airdrop,
                allowBoostingClime,
                boostingPlanId: user.boostingPlanId,
                boostingPlan,
            }
        });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Upgrade Mining Level
const upgradeMiningLevel = async (req, res) => {
    try {
        const { userId } = req.userData;

        let user = await models.User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const upgradeCost = user.miningLevel * 100;
        if (user.balance < upgradeCost) {
            return res.status(400).json({ error: "Insufficient balance" });
        }

        await models.sequelize.transaction(async (t) => {
            user.balance -= upgradeCost;
            user.miningLevel += 1;
            await user.save({ transaction: t });
        });

        res.json({ message: "Mining level upgraded!", newLevel: user.miningLevel });

    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

module.exports = {
    manageMining,
    checkMiningStatus,
    upgradeMiningLevel,
};
