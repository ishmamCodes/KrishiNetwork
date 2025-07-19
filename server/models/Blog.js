import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      user: String,
      text: String,
    }
  ],
}, {
  timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog; // ✅ This fixes your import issue
