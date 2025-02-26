const models = require("../models");

const manageMining = async (req, res) => {
    try {
        const { userId } = req.userData;
        let user = await models.User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const currentTime = new Date();
        let elapsedHours = 0;
        let minedAmount = 0;
        let miningActive = false;
        const miningRate = user.miningLevel * 0.02; // Mining rate per hour

        if (user.miningStartTime) {
            elapsedHours = (currentTime - new Date(user.miningStartTime)) / (1000 * 60 * 60);
            miningActive = elapsedHours < 24;

            if (miningActive) {
                minedAmount = parseFloat((elapsedHours * miningRate).toFixed(2));

                // Claim rewards without restarting mining
                await models.sequelize.transaction(async (t) => {
                    user.balance += minedAmount;
                    await user.save({ transaction: t });
                });

                return res.json({
                    message: "Mining active, rewards claimed",
                    miningActive: true,
                    minedAmount,
                    balance: user.balance,
                    timeLeft: (24 - elapsedHours).toFixed(2),
                    timePercentage: ((elapsedHours / 24) * 100).toFixed(2),
                    miningRate
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
            miningStartTime: user.miningStartTime,
            timePercentage: 0,
            miningRate
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
    upgradeMiningLevel,
};