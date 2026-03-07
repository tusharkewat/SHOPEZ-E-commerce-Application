import express, { Request, Response } from 'express';
import { Banner } from '../models/Banner';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Get current banner
router.get('/', async (req: Request, res: Response) => {
  try {
    const banner = await Banner.findOne().sort({ createdAt: -1 });

    if (!banner) {
      return res.json({ image_url: '' });
    }
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update banner
router.put('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const { imageUrl } = req.body;
    
    // Clear old banners and create the new one
    await Banner.deleteMany({});
    
    const newBanner = new Banner({ image_url: imageUrl });
    await newBanner.save();
    
    res.json(newBanner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update banner' });
  }
});

export default router;
