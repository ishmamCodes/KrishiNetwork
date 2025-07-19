import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);
  const nameInputRef = useRef(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!storedUser || !storedUser.id) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`${API_BASE_URL}/users/id/${storedUser.id}`);
        const userData = await userResponse.json();
        setUser(userData);
        setFormData({ name: userData.name, phone: userData.phone });

        // Fetch appointments
        const appointmentsResponse = await fetch(
          `${API_BASE_URL}/appointments/user/${storedUser.id}`
        );
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (editMode && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [editMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Update failed");

      setUser(data);
      setMessage("Profile updated successfully");
      setEditMode(false);

      // Update localStorage
      const stored = JSON.parse(localStorage.getItem("loggedInUser"));
      if (stored) {
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({ ...stored, name: data.name, phone: data.phone })
        );
      }
    } catch (error) {
      setMessage(error.message || "Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
    setTimeout(() => window.location.reload(), 100);
  };

  if (!user) return <div className="text-center mt-10">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-800">Welcome, {user.name}</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
        >
          Logout
        </button>
      </div>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Profile</h2>
        {editMode ? (
          <div className="space-y-2 mt-2">
            <input
              type="text"
              name="name"
              ref={nameInputRef}
              value={formData.name}
              onChange={handleInputChange}
              className="border px-4 py-2 w-full rounded focus:ring-2 focus:ring-green-500"
              placeholder="Name"
            />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border px-4 py-2 w-full rounded focus:ring-2 focus:ring-green-500"
              placeholder="Phone"
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditMode(false);
                  setFormData({ name: user.name, phone: user.phone });
                  setMessage("");
                }}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-2 bg-gray-200 px-4 py-1 rounded hover:bg-gray-300"
            >
              Edit Profile
            </button>
          </div>
        )}
        {message && <p className="text-sm mt-2 text-blue-600">{message}</p>}
      </div>

      {/* Appointments Section */}
      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments booked yet</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="border p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">
                    {appointment.expert?.name || "Expert"}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'accepted' 
                      ? 'bg-green-100 text-green-700' 
                      : appointment.status === 'rejected' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
                <p className="text-gray-600">
                  <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <strong>Time:</strong> {appointment.timeSlot}
                </p>
                {appointment.expert?.specialization && (
                  <p className="text-gray-600">
                    <strong>Specialization:</strong> {appointment.expert.specialization}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
