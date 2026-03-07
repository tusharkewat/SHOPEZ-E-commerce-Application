import express, { Request, Response } from 'express';
import { User } from '../models/User';
import { authenticate, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Admin: Get all users
router.get('/', authenticate, requireAdmin, async (req: Request, res: Response) => {
  console.log(`[Admin] GET /api/users called by user: ${req.user?.id} (${req.user?.role})`);
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Delete a user (Admin only)
router.delete('/:id', authenticate, requireAdmin, async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

export default router;
