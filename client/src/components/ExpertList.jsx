import React, { useEffect, useState } from 'react';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch experts list
  const fetchExperts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:4000/expert');
      if (!res.ok) {
        throw new Error('Error fetching experts');
      }
      const data = await res.json();
      setExperts(data);
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle expert availability with optimistic UI update
  const toggleAvailability = async (id) => {
    // Optimistic update - toggle availability immediately in the frontend
    setExperts(prevExperts => prevExperts.map(expert =>
      expert._id === id ? { ...expert, available: !expert.available } : expert
    ));

    try {
      const res = await fetch(`http://localhost:4000/expert/toggle/${id}`, {
        method: 'PUT',
      });
      if (!res.ok) {
        throw new Error('Error toggling availability');
      }
      // If the API request is successful, refetch the data
      fetchExperts();
    } catch (error) {
      console.error('Error toggling availability:', error);
      // If the API fails, revert the optimistic update
      fetchExperts();
    }
  };

  useEffect(() => {
    fetchExperts();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Expert Directory</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading experts...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-[#223142] text-white">
              <tr>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-6 py-3">Phone</th>
                <th className="text-left px-6 py-3">Specialization</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {experts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center px-6 py-4 text-gray-500">
                    No experts found.
                  </td>
                </tr>
              ) : (
                experts.map((expert, index) => (
                  <tr
                    key={expert._id}
                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} border-b`}
                  >
                    <td className="px-6 py-4">{expert.name}</td>
                    <td className="px-6 py-4">{expert.phone}</td>
                    <td className="px-6 py-4">{expert.specialization}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          expert.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {expert.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(expert._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200"
                      >
                        {expert.available ? 'Mark as Unavailable' : 'Mark as Available'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpertList;
