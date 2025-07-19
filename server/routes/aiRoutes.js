import dotenv from 'dotenv';
dotenv.config(); // ✅ Always load env first

import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: "Question required" });
    console.log("OpenAI Key Present?", !!process.env.OPENAI_API_KEY);

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const answer = response.data.choices[0].message.content;
    res.json({ answer });

  } catch (error) {
    console.error("OpenAI API error:", {
    message: error.message,
    data: error.response?.data,
    status: error.response?.status,
    });
    res.status(500).json({ error: "Error fetching answer" });
  }
});

export default router;