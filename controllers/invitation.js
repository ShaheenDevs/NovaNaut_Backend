const { Op } = require("sequelize");
const models = require("../models");

// ✅ Get list of invitations (by status or user)
const getInvitations = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ status: 400, message: "User ID is required" });
        }

        const invitations = await models.Invitation.findAll({
            where: { reReferralBy: userId },
            include: [
                { model: models.User, as: "user", attributes: ["id", "fullName", "email", "profile"] },
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

module.exports = { getInvitations, updateInvitationStatus, deleteInvitation };
