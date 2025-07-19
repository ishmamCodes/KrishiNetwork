import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Education = () => {
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ title: '', youtubeLink: '' });
  const [search, setSearch] = useState('');
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const fetchVideos = async () => {
    const res = await axios.get('http://localhost:4000/api/education');
    setVideos(res.data);
  };

  const handleUpload = async () => {
    if (!loggedInUser || loggedInUser.role !== 'expert') return alert("Experts only");
  
    const payload = {
      title: newVideo.title,
      link: newVideo.youtubeLink,  // Backend expects 'link'
      uploader: loggedInUser.name  // Backend expects 'uploader'
    };
  
    try {
      await axios.post('http://localhost:4000/api/education', payload);
      setNewVideo({ title: '', youtubeLink: '' });
      fetchVideos();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload video");
    }
  };
  

  useEffect(() => {
    fetchVideos();
  }, []);

  const getYouTubeEmbedUrl = (url) => {
    const id = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  };

  // Filter videos by search
  const filteredVideos = videos.filter(video =>
    video.title?.toLowerCase().includes(search.toLowerCase()) ||
    video.uploader?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      {loggedInUser?.role === 'expert' && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Video Title"
            value={newVideo.title}
            onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            placeholder="YouTube Link"
            value={newVideo.youtubeLink}
            onChange={(e) => setNewVideo({ ...newVideo, youtubeLink: e.target.value })}
            className="border p-2 mr-2"
          />
          <button onClick={handleUpload} className="bg-blue-600 text-white px-4 py-2">Upload</button>
        </div>
      )}

      <div className="mb-6 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search videos by title or uploader..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
      </div>

      <h2 className="text-xl font-bold mb-4">Educational Videos</h2>
      {filteredVideos.length === 0 ? (
        <p className="text-gray-600">No videos found.</p>
      ) : (
        filteredVideos.map((video) => (
          <div key={video._id || video.link} className="mb-6">
            <h3 className="font-semibold">{video.title}</h3>
            <iframe
              width="560"
              height="315"
              src={getYouTubeEmbedUrl(video.link)}
              title={video.title}
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        ))
      )}
    </div>
  );
};

export default Education;
