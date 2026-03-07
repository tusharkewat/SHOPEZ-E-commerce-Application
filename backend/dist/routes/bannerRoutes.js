"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Banner_1 = require("../models/Banner");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Get current banner
router.get('/', async (req, res) => {
    try {
        const banner = await Banner_1.Banner.findOne().sort({ createdAt: -1 });
        if (!banner) {
            return res.json({ image_url: '' });
        }
        res.json(banner);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Admin: Update banner
router.put('/', authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, async (req, res) => {
    try {
        const { imageUrl } = req.body;
        // Clear old banners and create the new one
        await Banner_1.Banner.deleteMany({});
        const newBanner = new Banner_1.Banner({ image_url: imageUrl });
        await newBanner.save();
        res.json(newBanner);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update banner' });
    }
});
exports.default = router;
