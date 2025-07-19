import React, { useState } from 'react';

const BlogForm = ({ onPostSubmit }) => {
  const user = JSON.parse(localStorage.getItem('loggedInUser'));
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handlePost = async () => {
    if (!user) {
      setError('You must be logged in to post.');
      return;
    }

    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    const res = await fetch('http://localhost:5000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: user.name,
        role: user.role,
        content,
      }),
    });

    if (res.ok) {
      setContent('');
      setError('');
      onPostSubmit();
    } else {
      setError('Failed to post.');
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <textarea
        rows="4"
        cols="50"
        placeholder="Write your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <br />
      <button onClick={handlePost}>Post</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default BlogForm;
