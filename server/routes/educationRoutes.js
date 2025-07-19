import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Schema
const educationSchema = new mongoose.Schema({
  link: { type: String, required: true },
  title: String,
  uploader: String,
  createdAt: { type: Date, default: Date.now },
});

const EducationVideo = mongoose.model('EducationVideo', educationSchema);

// GET all videos
router.get('/', async (req, res) => {
  try {
    const videos = await EducationVideo.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

// POST (for expert users)
router.post('/', async (req, res) => {
  try {
    const { link, title, uploader } = req.body;
    if (!link || !uploader) return res.status(400).json({ error: "Missing fields" });

    const newVideo = new EducationVideo({ link, title, uploader });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    console.error("Save error:", error);
    res.status(500).json({ error: "Failed to save video" });
  }
});

export default router;
