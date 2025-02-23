const models = require('../../models');
const { Op } = require("sequelize");

const getUserStatistics = async (req, res) => {
    try {
        // Count total users
        const totalUsers = await models.User.count();

        // Count total KYC verified users
        const totalKycUsers = await models.User.count({ where: { kyc: true } });

        // Count remaining KYC users
        const totalRemainingKycUsers = totalUsers - totalKycUsers;

        // Get active users based on updatedAt (users updated in the last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const activeUsers = await models.User.count({ where: { updatedAt: { [Op.gte]: thirtyDaysAgo } } });

        // Get new users based on createdAt (users created in the last 30 days)
        const newUsers = await models.User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });

        // Get last 10 new users
        const lastTenNewUsers = await models.User.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            attributes: ['id', 'fullName', 'email', 'phoneNo', 'kyc', 'blocked', 'miningLevel', 'createdAt']
        });

        res.status(200).json({
            status: 200,
            message: "User statistics retrieved successfully",
            data: {
                totalUsers,
                totalKycUsers,
                totalRemainingKycUsers,
                activeUsers,
                newUsers,
                lastTenNewUsers
            }
        });
    } catch (error) {
        console.error("Error fetching user statistics:", error);
        res.status(500).json({
            status: 500,
            message: "An error occurred while fetching user statistics",
            error: error.message
        });
    }
};

module.exports = { getUserStatistics };
