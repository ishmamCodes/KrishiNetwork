import React, { useEffect, useState } from "react";
import { FiEdit2, FiLogOut, FiChevronLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000";

const ExpertDashboard = () => {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  const expertId = stored.id;

  const [expert, setExpert] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    description: "",
    password: "",
    photoFile: null
  });
  const [photoPreview, setPhotoPreview] = useState(stored.photoUrl || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchExpertData = async () => {
      try {
        const [expertRes, appointmentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/expert/${expertId}`),
          fetch(`${API_BASE_URL}/appointments/expert/${expertId}/requests`)
        ]);

        if (!expertRes.ok) throw new Error("Failed to load expert data");
        if (!appointmentsRes.ok) throw new Error("Failed to load appointments");

        const expertData = await expertRes.json();
        const appointmentsData = await appointmentsRes.json();

        setExpert(expertData);
        setAppointments(appointmentsData);
        setForm({
          name: expertData.name,
          specialization: expertData.specialization,
          description: expertData.description,
          password: "",
          photoFile: null
        });
        setPhotoPreview(expertData.photoUrl || "/default-avatar.png");
      } catch (err) {
        setError(err.message);
      }
    };

    if (expertId) fetchExpertData();
  }, [expertId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, photoFile: file }));
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    try {
      let res;
      if (form.photoFile) {
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("specialization", form.specialization);
        fd.append("description", form.description);
        if (form.password) fd.append("password", form.password);
        fd.append("photo", form.photoFile);

        res = await fetch(`${API_BASE_URL}/expert/${expertId}`, {
          method: "PUT",
          body: fd
        });
      } else {
        const payload = {
          name: form.name,
          specialization: form.specialization,
          description: form.description
        };
        if (form.password) payload.password = form.password;

        res = await fetch(`${API_BASE_URL}/expert/${expertId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) throw new Error(await res.text());

      const updatedExpert = await res.json();
      setExpert(updatedExpert);
      setEditMode(false);
      setForm(f => ({ ...f, password: "", photoFile: null }));
      setPhotoPreview(updatedExpert.photoUrl || "/default-avatar.png");

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ ...stored, ...updatedExpert })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updatedAppointment = await res.json();
      setAppointments(prev =>
        prev.map(a => (a._id === appointmentId ? updatedAppointment : a))
      );
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    navigate("/login");
    setTimeout(() => window.location.reload(), 100);
  };

  if (!expertId) return null;
  if (error && !expert) return <p className="p-8 text-red-600">{error}</p>;
  if (!expert) return <p className="p-8 text-center">Loading…</p>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-6 text-green-800">Expert Panel</h2>
        <nav className="flex-1 space-y-4">
          <button
            onClick={() => setEditMode(false)}
            className={`block w-full text-left px-4 py-2 rounded ${
              !editMode ? "bg-green-200" : "hover:bg-gray-100"
            }`}
          >
            My Profile
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto text-red-600 hover:underline flex items-center space-x-1"
        >
          <FiLogOut /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-green-800">Hello, {expert.name}</h1>
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            <FiEdit2 className="mr-2" /> Edit Profile
          </button>
        </div>

        {/* Profile Info */}
        <div className="bg-white p-6 rounded-lg shadow mb-8 flex items-center space-x-6">
          <img
            src={photoPreview || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border"
          />
          <div className="space-y-1">
            <p><strong>Name:</strong> {expert.name}</p>
            <p><strong>Specialization:</strong> {expert.specialization}</p>
            <p><strong>About:</strong> {expert.description || "—"}</p>
          </div>
        </div>

        {/* Appointments Table */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Consultation Requests</h2>
          <div className="bg-white shadow rounded-lg overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(appointment => (
                  <tr key={appointment._id} className="border-t">
                    <td className="px-4 py-3">{appointment.user?.name || "User"}</td>
                    <td className="px-4 py-3">
                      {new Date(appointment.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{appointment.timeSlot}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-sm ${
                        appointment.status === 'accepted' ? 'bg-green-100 text-green-700' :
                        appointment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {appointment.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'accepted')}
                            className="text-green-600 hover:text-green-800"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'rejected')}
                            className="text-red-600 hover:text-red-800"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                      No consultation requests
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edit Panel */}
        {editMode && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
            <div className="w-96 bg-white h-full shadow-xl p-6 overflow-auto relative">
              <button
                onClick={() => setEditMode(false)}
                className="absolute top-4 left-4 text-gray-600 hover:text-black"
              >
                <FiChevronLeft size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1">Photo</label>
                  <input type="file" accept="image/*" onChange={handleFile} />
                  {photoPreview && (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="mt-2 w-20 h-20 rounded-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Description</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">New Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave blank to keep current"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-400"
                  />
                </div>
                {error && <p className="text-red-600">{error}</p>}
                <button
                  onClick={handleSave}
                  className="mt-4 w-full px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExpertDashboard;