const { Airdrop, User } = require("../models");

// 🎯 Assign Airdrop to a User
const assignAirdrop = async (req, res) => {
    try {
        const { tokens, userId } = req.body;

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const airdrops = await Airdrop.findOne({ where: { userId, status: "pending" } });
        if (airdrops) return res.status(404).json({ message: "Already not climed" });

        const airdrop = await Airdrop.create({ userId, tokens, status: "pending" });
        res.status(201).json({ message: "Airdrop assigned", airdrop });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// 🎯 Get Airdrops (With Pagination & Optional User Filter)
const getAirdrops = async (req, res) => {
    try {
        const { page = 1, limit = 10, userId } = req.query; // Pagination & Optional Filtering
        const offset = (page - 1) * limit;

        let whereCondition = {};
        if (userId) whereCondition.userId = userId; // Filter by userId if provided

        // Fetch Airdrops with Pagination
        const { count, rows: airdrops } = await Airdrop.findAndCountAll({
            where: whereCondition,
            include: [{ model: User, attributes: ["id", "fullName", "profile"] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]], // Sort by latest airdrops
        });

        if (!airdrops.length) return res.status(404).json({ message: "No airdrops found" });

        res.json({
            totalAirdrops: count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            airdrops,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🎯 Claim Airdrop (Update Status)
const claimAirdrop = async (req, res) => {
    try {
        const { airdropId } = req.params;
        const { userId } = req.userData;
        let user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "User not found" });
        const airdrop = await Airdrop.findByPk(airdropId);

        if (!airdrop) return res.status(404).json({ message: "Airdrop not found" });
        if (airdrop.status === "claimed") return res.status(400).json({ message: "Already claimed" });

        airdrop.status = "claimed";
        airdrop.claimedAt = new Date();
        await airdrop.save();
        // Update balance
        user.balance += airdrop.tokens;
        await user.save();
        res.json({ message: "Airdrop claimed successfully", airdrop });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 🎯 Delete Airdrop Entry
const deleteAirdrop = async (req, res) => {
    try {
        const { airdropId } = req.params;
        const deleted = await Airdrop.destroy({ where: { id: airdropId } });

        if (!deleted) return res.status(404).json({ message: "Airdrop not found" });

        res.json({ message: "Airdrop deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    assignAirdrop,
    getAirdrops,
    claimAirdrop,
    deleteAirdrop,
};