// routes/educationRoutes.js
import express from 'express';
import EducationVideo from '../models/EducationVideo.js';

const router = express.Router();

// Add new video (expert only)
router.post('/', async (req, res) => {
  const { title, youtubeLink, uploadedBy, role } = req.body;

  if (role !== 'expert') {
    return res.status(403).json({ error: "Only experts can upload." });
  }

  try {
    const video = new EducationVideo({ title, youtubeLink, uploadedBy });
    await video.save();
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    const videos = await EducationVideo.find().sort({ uploadedAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch videos" });
  }
});

export default router;
