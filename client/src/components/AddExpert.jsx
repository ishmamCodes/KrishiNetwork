import React, { useState, useEffect } from 'react';

const AddExpert = () => {
  const [expert, setExpert] = useState({
    name: '',
    phone: '',
    password: '',
    specialization: ''
  });
  const [sellerId, setSellerId] = useState(''); // Add sellerId state
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Get sellerId when component mounts (from localStorage or context)
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser && loggedInUser._id) {
      setSellerId(loggedInUser._id);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpert(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!sellerId) {
      setMessage('Seller information not found. Please log in again.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:4000/sellers/add-expert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...expert,
          sellerId // Include sellerId in the request
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add expert');
      }

      const data = await response.json();
      setMessage(data.message || 'Expert added successfully!');
      setExpert({
        name: '',
        phone: '',
        password: '',
        specialization: ''
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Add Expert</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={expert.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Type here"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={expert.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Type here"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={expert.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Type here"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="specialization">
            Specialization
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={expert.specialization}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Type here"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Expert'}
        </button>

        {message && (
          <p className={`mt-4 ${
            message.includes('success') ? 'text-green-600' : 'text-red-600'
          }`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddExpert;