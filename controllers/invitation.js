const { Op } = require("sequelize");
const models = require("../models");

// ✅ Send an invitation
const sendInvitation = async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({ status: 400, message: "Sender and Receiver IDs are required" });
        }

        // Check if an invitation already exists
        const existingInvitation = await models.Invitation.findOne({
            where: { senderId, receiverId }
        });

        if (existingInvitation) {
            return res.status(400).json({ status: 400, message: "Invitation already sent" });
        }

        const invitation = await models.Invitation.create({ senderId, receiverId, status: "pending" });

        res.status(201).json({ status: 201, message: "Invitation sent", data: invitation });
    } catch (error) {
        console.error("Send Invitation Error:", error);
        res.status(500).json({ status: 500, message: "Error sending invitation", error: error.message });
    }
};

// ✅ Get list of invitations (by status or user)
const getInvitations = async (req, res) => {
    try {
        const { userId, status } = req.query;

        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is required" });
        }

        const whereCondition = {
            [Op.or]: [{ senderId: userId }, { receiverId: userId }]
        };
        if (status) whereCondition.status = status;

        const invitations = await models.Invitation.findAll({
            where: whereCondition,
            include: [
                { model: models.User, as: "sender", attributes: ["id", "fullName", "email"] },
                { model: models.User, as: "receiver", attributes: ["id", "fullName", "email"] }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({ status: 200, message: "Invitations retrieved", data: invitations });
    } catch (error) {
        console.error("Get Invitations Error:", error);
        res.status(500).json({ status: 500, message: "Error fetching invitations", error: error.message });
    }
};

// ✅ Accept or Reject an invitation
const updateInvitationStatus = async (req, res) => {
    try {
        const { invitationId, status } = req.query;

        if (!invitationId || !["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ status: 400, message: "Valid invitation ID and status are required" });
        }

        const invitation = await models.Invitation.findByPk(invitationId);
        if (!invitation) {
            return res.status(404).json({ status: 404, message: "Invitation not found" });
        }

        invitation.status = status;
        await invitation.save();

        res.status(200).json({ status: 200, message: `Invitation ${status}`, data: invitation });
    } catch (error) {
        console.error("Update Invitation Status Error:", error);
        res.status(500).json({ status: 500, message: "Error updating invitation status", error: error.message });
    }
};

// ✅ Delete an invitation
const deleteInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;

        const invitation = await models.Invitation.findByPk(invitationId);
        if (!invitation) {
            return res.status(404).json({ status: 404, message: "Invitation not found" });
        }

        await invitation.destroy();
        res.status(200).json({ status: 200, message: "Invitation deleted" });
    } catch (error) {
        console.error("Delete Invitation Error:", error);
        res.status(500).json({ status: 500, message: "Error deleting invitation", error: error.message });
    }
};

module.exports = { sendInvitation, getInvitations, updateInvitationStatus, deleteInvitation };
