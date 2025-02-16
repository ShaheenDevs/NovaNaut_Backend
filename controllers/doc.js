const models = require('../models');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the "documents" directory exists
const uploadDir = 'documents/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname); // Get original file extension
        cb(null, `${file.fieldname}${ext}`); // Save with original extension
    }
});

// File filter to allow only PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Multer Upload Middleware
const upload = multer({ storage, fileFilter });

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

// Update Document URLs (Single Record) with File Upload
const updateDocumentUrls = async (req, res) => {
    try {
        let documentRecord = await models.Doc.findOne();

        if (!documentRecord) {
            return res.status(404).json({ status: 404, message: "No document URLs found to update" });
        }

        const updateData = {};
        if (req.files.privacyPolicy) {
            updateData.privacyPolicy = `/documents/${req.files.privacyPolicy[0].filename}`;
        }
        if (req.files.termsConditions) {
            updateData.termsConditions = `/documents/${req.files.termsConditions[0].filename}`;
        }
        if (req.files.whitePaper) {
            updateData.whitePaper = `/documents/${req.files.whitePaper[0].filename}`;
        }

        await documentRecord.update(updateData);

        return res.status(200).json({ status: 200, message: "Document URLs updated successfully", data: documentRecord });
    } catch (error) {
        console.error("Error updating document URLs:", error);
        res.status(500).json({ status: 500, message: "An error occurred", error: error.message });
    }
};

// Export with Multer Middleware
module.exports = {
    getDocumentUrls,
    updateDocumentUrls: [upload.fields([
        { name: 'privacyPolicy', maxCount: 1 },
        { name: 'termsConditions', maxCount: 1 },
        { name: 'whitePaper', maxCount: 1 }
    ]), updateDocumentUrls]
};
