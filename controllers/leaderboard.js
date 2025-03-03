const models = require("../models");

const getLeaderboard = async (req, res) => {
    try {
        const { limit = 10, offset = 0 } = req.query;

        // Fetch all users ordered by balance to get correct rank
        const allUsers = await models.User.findAll({
            attributes: ['id', 'fullName', "email", "profile", "country", "kyc", 'balance'],
            order: [['balance', 'DESC']]
        });

        // Paginate the users and assign ranks
        const paginatedUsers = allUsers.slice(parseInt(offset), parseInt(offset) + parseInt(limit))
            .map((user, index) => ({
                ...user.toJSON(),
                rank: parseInt(offset) + index + 1 // Correct rank calculation
            }));

        res.status(200).json({
            status: 200,
            message: "Leaderboard fetched successfully",
            data: paginatedUsers
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
