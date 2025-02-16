const express = require('express');
const models = require('../models');

// Create a new wallpaper
const addWallpaper = async (req, res) => {
    try {
        const { title, category, imageUrl } = req.body;
        const newWallpaper = await models.Wallpaper.create({ title, category, imageUrl });

        res.status(201).json({ status: 201, message: "Wallpaper created", data: newWallpaper });
    } catch (error) {
        console.error("Error creating wallpaper:", error);
        res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }
};

// Get wallpapers with pagination (20 per page)
const getWallpaper = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;

        const { count, rows } = await models.Wallpaper.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            status: 200,
            total: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            data: rows,
        });
    } catch (error) {
        console.error("Error fetching wallpapers:", error);
        res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }
};

// Update a wallpaper
const updateWallpaper = async (req, res) => {
    try {
        const { title, category, imageUrl } = req.body;
        const wallpaper = await models.Wallpaper.findByPk(req.params.id);

        if (!wallpaper) {
            return res.status(404).json({ status: 404, message: "Wallpaper not found" });
        }

        await wallpaper.update({ title, category, imageUrl });

        res.status(200).json({ status: 200, message: "Wallpaper updated", data: wallpaper });
    } catch (error) {
        console.error("Error updating wallpaper:", error);
        res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }
};

// Delete a wallpaper
const deleteWallpaper = async (req, res) => {
    try {
        const wallpaper = await models.Wallpaper.findByPk(req.params.id);
        if (!wallpaper) {
            return res.status(404).json({ status: 404, message: "Wallpaper not found" });
        }

        await wallpaper.destroy();
        res.status(200).json({ status: 200, message: "Wallpaper deleted" });
    } catch (error) {
        console.error("Error deleting wallpaper:", error);
        res.status(500).json({ status: 500, message: "Internal server error", error: error.message });
    }
};

module.exports = { addWallpaper, getWallpaper, updateWallpaper, deleteWallpaper };
