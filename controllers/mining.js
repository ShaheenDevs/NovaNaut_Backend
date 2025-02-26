const models = require("../models");

const manageMining = async (req, res) => {
    try {
        const { userId } = req.userData;
        let user = await models.User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        let currentTime = new Date();
        let elapsedHours = 0;
        let minedAmount = 0;
        let miningActive = false;

        if (user.miningStartTime) {
            elapsedHours = (currentTime - new Date(user.miningStartTime)) / (1000 * 60 * 60);
            if (elapsedHours < 24) {
                miningActive = true;
                minedAmount = parseFloat((elapsedHours * (user.miningLevel * 0.02)).toFixed(2));

                // Claim rewards if mining is still active
                await models.sequelize.transaction(async (t) => {
                    user.balance += Math.floor(minedAmount);
                    user.miningStartTime = user.miningStartTime; // Keep current mining session active
                    await user.save({ transaction: t });
                });

                return res.json({
                    message: "Mining active, rewards claimed",
                    miningActive: true,
                    minedAmount,
                    balance: user.balance,
                    timeLeft: (24 - elapsedHours).toFixed(2)
                });
            }
        }

        // If mining exceeded 24 hours, cap rewards at 24 hours and restart
        if (elapsedHours >= 24) {
            minedAmount = parseFloat((24 * (user.miningLevel * 0.02)).toFixed(2));

            await models.sequelize.transaction(async (t) => {
                user.balance += Math.floor(minedAmount);
                user.miningStartTime = new Date(); // Restart mining
                await user.save({ transaction: t });
            });

            return res.json({
                message: "Mining session expired, rewards claimed and restarted",
                miningActive: true,
                minedAmount,
                balance: user.balance,
                miningStartTime: user.miningStartTime
            });
        }

        // Start mining if not active
        user.miningStartTime = new Date();
        await user.save();
        res.json({
            message: "Mining started successfully",
            miningActive: true,
            miningStartTime: user.miningStartTime,
            balance: user.balance
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