const models = require('../../models');
const { Op } = require("sequelize");

const getAllUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, kyc, blocked, miningLevel, country, emailVerified } = req.query;
        const offset = (page - 1) * limit;

        // Build filters dynamically
        const filters = {};
        if (kyc !== undefined) filters.kyc = kyc === 'true';
        if (blocked !== undefined) filters.blocked = blocked === 'true';
        if (miningLevel !== undefined) filters.miningLevel = miningLevel;
        if (country !== undefined) filters.country = country;
        if (emailVerified !== undefined) filters.emailVerified = emailVerified === 'true';

        // Fetch users with pagination and filters
        const users = await models.User.findAndCountAll({
            where: filters,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']],
            attributes: ['id', 'fullName', 'email', 'phoneNo', 'kyc', 'blocked', 'miningLevel', 'country', 'emailVerified', 'updatedAt', 'createdAt']
        });

        // Calculate `isActive` (active in the last 24 hours)
        const currentTime = new Date();
        users.rows = users.rows.map(user => {
            const lastUpdated = new Date(user.updatedAt);
            const isActive = (currentTime - lastUpdated) / (1000 * 60 * 60) <= 24; // Active within last 24 hours
            return { ...user.toJSON(), isActive };
        });

        res.status(200).json({
            status: 200,
            message: "Users retrieved successfully",
            data: {
                totalUsers: users.count,
                totalPages: Math.ceil(users.count / limit),
                currentPage: parseInt(page),
                users: users.rows,
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            status: 500,
            message: "An error occurred while fetching users",
            error: error.message
        });
    }
};

module.exports = { getAllUsers };
