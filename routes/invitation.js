const express = require("express");
const router = express.Router();
const invitationController = require("../controllers/invitation");

// Routes
router.get("/list", invitationController.getInvitations);
router.put("/update-status", invitationController.updateInvitationStatus);
router.delete("/delete/:invitationId", invitationController.deleteInvitation);

module.exports = router;
