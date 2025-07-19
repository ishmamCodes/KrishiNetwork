import express from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

// Create new blog
router.post('/', async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: "Title, content, and author are required." });
    }

    const newBlog = new Blog({ title, content, author });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    console.error("Error creating blog:", err);
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// Get all blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Like a blog
router.post('/:id/like', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.likes += 1;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to like blog" });
  }
});

// Comment on a blog
router.post('/:id/comment', async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!user || !text) return res.status(400).json({ error: "User and comment text required" });

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    blog.comments.push({ user, text });
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to comment on blog" });
  }
});

export default router;
