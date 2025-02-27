
const { Op } = require("sequelize");
const models = require("../models");

// ✅ Create a new level
const createLevel = async (req, res) => {
    try {
        const { level, title, rate, condition } = req.body;
        if (!level || !title || !rate || !condition) {
            return res.status(400).json({ status: 400, message: "Level, title, rate, and condition are required" });
        }

        const newLevel = await models.Level.create({ level, title, rate, condition });
        res.status(201).json({ status: 201, message: "Level created", data: newLevel });
    } catch (error) {
        console.error("Create Level Error:", error);
        res.status(500).json({ status: 500, message: "Error creating level", error: error.message });
    }
};

// ✅ Get all levels
const getLevels = async (req, res) => {
    try {
        const levels = await models.Level.findAll();
        res.status(200).json({ status: 200, message: "Levels retrieved", data: levels });
    } catch (error) {
        console.error("Get Levels Error:", error);
        res.status(500).json({ status: 500, message: "Error fetching levels", error: error.message });
    }
};

// ✅ Get a single level
const getLevelById = async (req, res) => {
    try {
        const { id } = req.params;
        const level = await models.Level.findByPk(id);
        if (!level) {
            return res.status(404).json({ status: 404, message: "Level not found" });
        }
        res.status(200).json({ status: 200, message: "Level retrieved", data: level });
    } catch (error) {
        console.error("Get Level Error:", error);
        res.status(500).json({ status: 500, message: "Error fetching level", error: error.message });
    }
};

// ✅ Update a level
const updateLevel = async (req, res) => {
    try {
        const { id } = req.params;
        const { level, title, rate, condition } = req.query;
        const existingLevel = await models.Level.findByPk(id);
        if (!existingLevel) {
            return res.status(404).json({ status: 404, message: "Level not found" });
        }
        await existingLevel.update({ level, title, rate, condition });

        res.status(200).json({ status: 200, message: "Level updated", data: existingLevel });
    } catch (error) {
        console.error("Update Level Error:", error);
        res.status(500).json({ status: 500, message: "Error updating level", error: error.message });
    }
};

// ✅ Delete a level
const deleteLevel = async (req, res) => {
    try {
        const { id } = req.params;
        const level = await models.Level.findByPk(id);
        if (!level) {
            return res.status(404).json({ status: 404, message: "Level not found" });
        }

        await level.destroy();
        res.status(200).json({ status: 200, message: "Level deleted" });
    } catch (error) {
        console.error("Delete Level Error:", error);
        res.status(500).json({ status: 500, message: "Error deleting level", error: error.message });
    }
};

module.exports = { createLevel, getLevels, getLevelById, updateLevel, deleteLevel };
