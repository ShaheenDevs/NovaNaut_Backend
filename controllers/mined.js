const models = require('../models');
const cron = require('node-cron');

// Mined API - Retrieve mining data
const getMineTokens = async (req, res) => {
    try {
        const minedRecord = await models.Mined.findOne();
        if (!minedRecord) {
            return res.status(404).json({ status: 404, message: "Mined record not found" });
        }
        res.status(200).json({ status: 200, message: "Mining data retrieved successfully", data: minedRecord });
    } catch (error) {
        console.error("Error retrieving mining process:", error);
        res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }
};

const mineTokens = async () => {
    try {
        const users = await models.User.findAll({ attributes: ['balance'] });
        const totalMinedTokens = users.reduce((sum, user) => sum + user.balance, 0);
        
        const minedRecord = await models.Mined.findByPk(1);
        if (!minedRecord) {
            console.error("Mined record with ID 1 not found");
            return;
        }
        
        const TOTAL_MINEABLE_TOKENS = minedRecord.totalMineableTokens;
        const remainderTokens = TOTAL_MINEABLE_TOKENS - totalMinedTokens;
        const isAllow = remainderTokens > 0;

        await minedRecord.update({ totalMinedTokens, remainderTokens, isAllow });

        console.log("Mining process completed successfully");
    } catch (error) {
        console.error("Error running mining process:", error);
    }
};

const updateMineAbleTokens = async (req, res) => {
    try {
        const totalMinedTokens = await models.User.sum('balance');
        const minedRecord = await models.Mined.findOne();
        if (!minedRecord) {
            return res.status(404).json({ status: 404, message: "Mined record not found" });
        }
        
        await minedRecord.update({ totalMinedTokens });
        res.status(200).json({ status: 200, message: "Mineable tokens updated successfully", data: minedRecord });
    } catch (error) {
        console.error("Error updating mineable tokens:", error);
        res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }
};

// Schedule mining process to run every 6 hours
// cron.schedule('0 */6 * * *', mineTokens);
cron.schedule('* * * * *', mineTokens);

module.exports = { getMineTokens, mineTokens, updateMineAbleTokens };
