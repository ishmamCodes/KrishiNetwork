import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:4000";

const Support = () => {
  const navigate = useNavigate();
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/expert`);
        if (!res.ok) throw new Error("Failed to fetch experts");
        const data = await res.json();
        setExperts(data);
      } catch (err) {
        console.error("Error fetching experts:", err);
        setError("Could not load expert profiles.");
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedSlot('');
    setBookingError('');
    setBookingSuccess('');

    try {
      const res = await fetch(
        `${API_BASE_URL}/appointments/expert/${selectedExpert._id}/slots?date=${date}`
      );
      const data = await res.json();
      if (res.ok) setTimeSlots(data);
      else setTimeSlots([]);
    } catch (err) {
      console.error(err);
      setTimeSlots([]);
    }
  };

  const bookAppointment = async () => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setBookingError("Please select a date and time slot.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expertId: selectedExpert._id,
          userId: user.id,
          date: selectedDate,
          timeSlot: selectedSlot,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Booking failed");

      setBookingSuccess("Appointment booked successfully!");
      setBookingError("");
      setSelectedSlot("");
      setSelectedDate("");
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      setBookingError(err.message);
      setBookingSuccess("");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-green-800 mb-6">Expert Support</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
              <div className="w-full h-40 bg-gray-200 mb-4 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))
        ) : experts.length > 0 ? (
          experts.map((exp) => (
            <div key={exp._id} className="bg-white rounded shadow p-4 hover:shadow-lg transition-shadow">
              <img
                loading="lazy"
                src={exp.photoUrl || "/default-avatar.png"}
                alt={exp.name}
                className="w-full h-40 object-contain bg-gray-100 border mb-3 rounded"
              />
              <h2 className="text-lg font-semibold">{exp.name}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Specialization:</strong> {exp.specialization}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Phone:</strong> {exp.phone}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Description:</strong> {exp.description || "No description provided"}
              </p>

              <p className="text-sm">
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    exp.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {exp.available ? "Available" : "Unavailable"}
                </span>
              </p>

              {exp.available && (
                <button
                  onClick={() => {
                    setSelectedExpert(exp);
                    setShowModal(true);
                    setBookingSuccess('');
                    setBookingError('');
                  }}
                  className="mt-2 w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Book Appointment
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No experts available at the moment.</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">
              Book Appointment with {selectedExpert?.name}
            </h2>

            <label className="block mb-2">Select Date</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full p-2 border rounded mb-4"
              value={selectedDate}
            />

            {selectedDate && (
              <>
                <label className="block mb-2">Available Time Slots</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {timeSlots.length > 0 ? (
                    timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded text-sm ${
                          selectedSlot === slot
                            ? "bg-green-600 text-white"
                            : "bg-blue-100 hover:bg-blue-200"
                        }`}
                      >
                        {slot}
                      </button>
                    ))
                  ) : (
                    <p className="text-red-500 col-span-2 text-sm">
                      No available slots for this date
                    </p>
                  )}
                </div>

                <button
                  onClick={bookAppointment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                >
                  Confirm Appointment
                </button>
              </>
            )}

            {bookingError && (
              <p className="text-red-500 text-sm mt-2">{bookingError}</p>
            )}
            {bookingSuccess && (
              <p className="text-green-600 text-sm mt-2">{bookingSuccess}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
