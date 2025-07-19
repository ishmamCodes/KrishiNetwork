import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });
  const [commentText, setCommentText] = useState({});
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/blogs');
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  const handlePost = async () => {
    if (!loggedInUser) {
      alert("Please log in first to post.");
      return;
    }

    if (!newBlog.title || !newBlog.content) {
      alert("Title and content are required.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/blogs', {
        ...newBlog,
        author: loggedInUser.name,
      });

      console.log('Post response:', res.data);
      setNewBlog({ title: '', content: '' });
      fetchBlogs();
    } catch (error) {
      console.error("Error posting blog:", error);
    }
  };

  const handleLike = async (id) => {
    try {
      await axios.post(`http://localhost:4000/api/blogs/${id}/like`);
      fetchBlogs();
    } catch (error) {
      console.error("Error liking blog:", error);
    }
  };

  const handleComment = async (id) => {
    if (!loggedInUser) return alert("Please log in to comment.");
    if (!commentText[id]) return;

    try {
      await axios.post(`http://localhost:4000/api/blogs/${id}/comment`, {
        user: loggedInUser.name,
        text: commentText[id],
      });
      setCommentText({ ...commentText, [id]: '' });
      fetchBlogs();
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post a Blog</h2>
      <input
        type="text"
        placeholder="Title"
        value={newBlog.title}
        onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <textarea
        placeholder="Content"
        value={newBlog.content}
        onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handlePost}
        className="px-4 py-2 bg-green-600 text-white rounded mb-6"
      >
        Post
      </button>

      <h2 className="text-2xl font-bold mt-10 mb-4">All Blogs</h2>
      {blogs.map((blog) => (
        <div key={blog._id} className="border-b py-4">
          <h3 className="text-xl font-semibold">{blog.title}</h3>
          <p className="text-gray-700">{blog.content}</p>
          <p className="text-sm text-gray-500">
            Posted by {blog.author} on {new Date(blog.createdAt).toLocaleString()}
          </p>

          <button onClick={() => handleLike(blog._id)} className="text-blue-600 mt-1">
            👍 Like ({blog.likes})
          </button>

          <div className="mt-2">
            <input
              type="text"
              placeholder="Add a comment"
              value={commentText[blog._id] || ''}
              onChange={(e) =>
                setCommentText({ ...commentText, [blog._id]: e.target.value })
              }
              className="border p-1 w-2/3"
            />
            <button
              onClick={() => handleComment(blog._id)}
              className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
            >
              Comment
            </button>
          </div>

          {blog.comments?.length > 0 && (
            <div className="mt-2 text-sm text-gray-800">
              <strong>Comments:</strong>
              {blog.comments.map((c, idx) => (
                <div key={idx} className="ml-2 mt-1">
                  <span className="font-semibold">{c.user}:</span> {c.text}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Blog;
