import express from 'express';
const router = express.Router();
import { logout, signup, login, getUserById, updateUserProfile } from '../controllers/usercontrollers.js';
import User from '../models/User.js'; // ✅ Make sure this is imported

// Use `router`, not `userRoutes`
router.post('/signup', signup);
router.post('/login', login);
router.get('/id/:userId', getUserById);
router.get('/logout', logout);
router.put('/:id', updateUserProfile);

// Search users by name or phone
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
