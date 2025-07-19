import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messenger = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let interval;
    if (loggedInUser && selectedUser) {
      fetchMessages(); // initial load
      interval = setInterval(fetchMessages, 3000); // fetch every 3 seconds
    }
    return () => clearInterval(interval); // cleanup
  }, [selectedUser]);

  const handleSearch = async () => {
    if (!searchQuery) return;
    try {
      const res = await axios.get(`http://localhost:4000/users/search?query=${searchQuery}`);
      setSearchResults(res.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/messages/${loggedInUser.phone}/${selectedUser.phone}`);
      setMessages(res.data);
    } catch (error) {
      console.error("Fetch chat error:", error);
    }
  };

  const sendMessage = async () => {
    if (!text || !selectedUser || !loggedInUser) return alert("All fields required");

    try {
      const payload = {
        senderPhone: loggedInUser.phone,
        recipientPhone: selectedUser.phone,
        text
      };

      await axios.post('http://localhost:4000/api/messages', payload);
      setText('');
      fetchMessages();
    } catch (error) {
      console.error("Send message error:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Message Someone</h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-3 py-1 rounded">Search</button>
      </div>

      {/* Search results */}
      <div className="mb-4">
        {searchResults.map(user => (
          <div key={user._id} className="cursor-pointer border p-2 mb-1 hover:bg-gray-100"
            onClick={() => setSelectedUser(user)}>
            {user.name} ({user.phone})
          </div>
        ))}
      </div>

      {/* Chat box */}
      {selectedUser && (
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">Chat with {selectedUser.name}</h3>

          <div className="h-60 overflow-y-scroll border p-2 mb-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.sender === loggedInUser._id ? 'text-right' : 'text-left'}`}>
                <span className="inline-block bg-green-100 px-3 py-1 rounded">{msg.text}</span>
              </div>
            ))}
          </div>

          <div className="flex">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border p-2 flex-grow mr-2"
            />
            <button onClick={sendMessage} className="bg-green-500 text-white px-4 py-2 rounded">Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messenger;