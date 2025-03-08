const models = require("../models");

// ✅ 1. KYC Document
const addKYC = async (req, res) => {
  try {
    const { cnicFrontUrl, cnicBackUrl } = req.body;
    const userId = req.userData.userId;

    if (!cnicFrontUrl && !cnicBackUrl) {
      return res.status(400).json({ status: 400, message: "No document uploaded" });
    }

    const existingKYC = await models.KYC.findOne({ where: { userId } });
    if (existingKYC) {
      return res.status(400).json({ status: 400, message: "KYC already submitted" });
    }

    const newKYC = await models.KYC.create({
      userId,
      cnicFrontUrl,
      cnicBackUrl,
      status: "pending",
    });

    res.status(201).json({ status: 201, message: "KYC submitted successfully", data: newKYC });
  } catch (error) {
    console.error("KYC Upload Error:", error);
    res.status(500).json({ status: 500, message: "Error submitting KYC", error: error.message });
  }

};

// ✅ 2. Approve/Reject KYC (Admin Action)
const verifyKYC = async (req, res) => {
  try {
    const { kycId, status, rejectionReason } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ status: 400, message: "Invalid status" });
    }

    const kyc = await models.KYC.findByPk(kycId);
    if (!kyc) {
      return res.status(404).json({ status: 404, message: "KYC not found" });
    }

    await kyc.update({ status, rejectionReason: status === "rejected" ? rejectionReason : null });

    res.status(200).json({ status: 200, message: `KYC ${status} successfully` });
  } catch (error) {
    console.error("KYC Verification Error:", error);
    res.status(500).json({ status: 500, message: "Error verifying KYC", error: error.message });
  }
};

// ✅ 3. Fetch User's KYC Status
const getKYCStatus = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const kyc = await models.KYC.findOne({ where: { userId } });

    if (!kyc) {
      return res.status(404).json({ status: 404, message: "KYC not submitted" });
    }

    res.status(200).json({ status: 200, data: kyc });
  } catch (error) {
    console.error("Get KYC Status Error:", error);
    res.status(500).json({ status: 500, message: "Error fetching KYC status", error: error.message });
  }
};

// ✅ 4. Fetch All KYC Records with Pagination
const getAllKYCStatus = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default page 1, limit 10

    const offset = (page - 1) * limit;

    const { count, rows: kycRecords } = await models.KYC.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']], // Optional: Order by newest first
    });

    if (!kycRecords.length) {
      return res.status(404).json({
        status: 404,
        message: "No KYC records found."
      });
    }

    res.status(200).json({
      status: 200,
      data: kycRecords,
      totalRecords: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error("Get All KYC Status Error:", error);
    res.status(500).json({
      status: 500,
      message: "Error fetching KYC records",
      error: error.message,
    });
  }
};

module.exports = { addKYC, verifyKYC, getKYCStatus, getAllKYCStatus };