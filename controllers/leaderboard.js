const models = require("../models");

const getLeaderboard = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query; // Pagination support

        const users = await models.User.findAll({
            attributes: ['id', 'fullName', "email", "profile", "country", "kyc", 'balance'],
            order: [['balance', 'DESC']], // Sort users by balance in descending order
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            status: 200,
            message: "Leaderboard fetched successfully",
            data: users
        });
    } catch (error) {
        console.error("Leaderboard error:", error);
        res.status(500).json({ status: 500, message: "Error fetching leaderboard", error: error.message });
    }
};

const getUserRank = async (req, res) => {
    try {
        const { userId } = req.params;

        const users = await models.User.findAll({
            attributes: ['id', 'fullName', "email", "profile", "country", "kyc", 'balance'],
            order: [['balance', 'DESC']],
        });

        const userIndex = users.findIndex(user => user.id == userId);
        if (userIndex === -1) {
            return res.status(404).json({ status: 404, message: "User not found" });
        }

        const user = users[userIndex];

        res.status(200).json({
            status: 200,
            message: "User rank fetched successfully",
            data: {
                userId: user.id,
                fullName: user.fullName,
                balance: user.balance,
                rank: userIndex + 1
            }
        });
    } catch (error) {
        console.error("User rank error:", error);
        res.status(500).json({ status: 500, message: "Error fetching user rank", error: error.message });
    }
};

module.exports = { getLeaderboard, getUserRank };
