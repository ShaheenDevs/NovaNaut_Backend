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
        const lastMonthActiveUsers = await models.User.count({ where: { updatedAt: { [Op.gte]: thirtyDaysAgo } } });

        // Get new users based on createdAt (users created in the last 30 days)
        const lastMonthNewUsers = await models.User.count({ where: { createdAt: { [Op.gte]: thirtyDaysAgo } } });

        // Get last 10 new users
        const lastTenNewUsers = await models.User.findAll({
            order: [['createdAt', 'DESC']],
            limit: 10,
            attributes: ['id', 'fullName', 'email', 'phoneNo', 'kyc', 'blocked', 'miningLevel', 'createdAt']
        });

        // Generate date range for last 12 months
        const currentDate = new Date();
        const last12Months = [...Array(12)].map((_, i) => {
            const date = new Date(currentDate);
            date.setMonth(date.getMonth() - i);
            return { year: date.getFullYear(), month: date.getMonth() + 1 };
        });

        // Fetch new users per month
        const newUsersByMonth = await Promise.all(
            last12Months.map(async ({ year, month }) => {
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0, 23, 59, 59);

                const count = await models.User.count({
                    where: { createdAt: { [Op.between]: [startDate, endDate] } }
                });

                return { year, month, count };
            })
        );

        // Fetch active users per month
        const activeUsersByMonth = await Promise.all(
            last12Months.map(async ({ year, month }) => {
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0, 23, 59, 59);

                const count = await models.User.count({
                    where: { updatedAt: { [Op.between]: [startDate, endDate] } }
                });

                return { year, month, count };
            })
        );

        // Format graph data
        const graphData = last12Months.map(({ year, month }, index) => ({
            label: new Date(year, month - 1).toLocaleString("default", { month: "short", year: "numeric" }), // Example: "Jan 2024"
            newUsers: newUsersByMonth[index].count,
            activeUsers: activeUsersByMonth[index].count
        }));

        const minedRecord = await models.Mined.findOne(
            {
                attributes: ["totalMineableTokens", "totalMinedTokens", "remainderTokens", "isAllow"]
            }
        );

        res.status(200).json({
            status: 200,
            message: "User statistics retrieved successfully",
            data: {
                totalUsers,
                totalKycUsers,
                totalRemainingKycUsers,
                lastMonthActiveUsers,
                lastMonthNewUsers,
                minedRecord,
                lastTenNewUsers,
                graphData,
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
