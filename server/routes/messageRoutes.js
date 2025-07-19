// routes/messageRoutes.js
import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

/**
 * POST /api/messages
 * Send a new message
 */
router.post('/', async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  if (!senderId || !receiverId || !text) {
    return res.status(400).json({ error: 'Missing senderId, receiverId, or text' });
  }

  try {
    const newMessage = new Message({ senderId, receiverId, text });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/**
 * GET /api/messages/:userId1/:userId2
 * Fetch chat history between two users
 */
router.get('/:userId1/:userId2', async (req, res) => {
  const { userId1, userId2 } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 },
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

export default router;
