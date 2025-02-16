const models = require('../models');

// Get Document URLs (Single Record)
const getDocumentUrls = async (req, res) => {
    try {
        const documentRecord = await models.Doc.findOne();
        if (!documentRecord) {
            return res.status(404).json({ status: 404, message: "No document URLs found" });
        }
        res.status(200).json({ status: 200, message: "Document URLs retrieved successfully", data: documentRecord });
    } catch (error) {
        console.error("Error fetching document URLs:", error);
        res.status(500).json({ status: 500, message: "An error occurred", error: error.message });
    }
};

// Update Document URLs (Single Record)
const updateDocumentUrls = async (req, res) => {
    try {
        const { privacyPolicy, termsConditions, whitePaper } = req.body;

        let documentRecord = await models.Doc.findOne();

        if (!documentRecord) {
            return res.status(404).json({ status: 404, message: "No document URLs found to update" });
        }

        await documentRecord.update({ privacyPolicy, termsConditions, whitePaper });

        return res.status(200).json({ status: 200, message: "Document URLs updated successfully", data: documentRecord });
    } catch (error) {
        console.error("Error updating document URLs:", error);
        res.status(500).json({ status: 500, message: "An error occurred", error: error.message });
    }
};

module.exports = { getDocumentUrls, updateDocumentUrls };
