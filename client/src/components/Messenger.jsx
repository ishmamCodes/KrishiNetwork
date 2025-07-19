import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messenger = () => {
  const [query, setQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

  const handleSearch = async () => {
    const res = await axios.get(`http://localhost:4000/users/search?query=${query}`);
    setUsers(res.data);
  };

  const selectUser = async (user) => {
    setSelectedUser(user);
    const res = await axios.get(`http://localhost:4000/api/messages/${loggedInUser._id}/${user._id}`);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!text) return;
    const res = await axios.post(`http://localhost:4000/api/messages`, {
      senderId: loggedInUser._id,
      receiverId: selectedUser._id,
      text
    });
    setMessages([...messages, res.data]);
    setText('');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Messenger</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name or phone"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Users</h3>
          {users.map(user => (
            <div
              key={user._id}
              className="p-2 border mb-1 cursor-pointer hover:bg-gray-100"
              onClick={() => selectUser(user)}
            >
              {user.name} ({user.phone})
            </div>
          ))}
        </div>

        {selectedUser && (
          <div>
            <h3 className="font-semibold mb-2">Chat with {selectedUser.name}</h3>
            <div className="h-64 border p-2 overflow-y-auto bg-gray-50 mb-2">
              {messages.map((msg, idx) => (
                <div key={idx} className={`mb-1 ${msg.senderId === loggedInUser._id ? 'text-right' : 'text-left'}`}>
                  <span className="inline-block bg-green-100 p-1 rounded">{msg.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="border flex-grow p-2"
                placeholder="Type a message"
              />
              <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-2 rounded">Send</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
