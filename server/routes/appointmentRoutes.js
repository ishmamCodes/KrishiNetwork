// routes/appointmentRoutes.js
import express from "express";
import Appointment from "../models/Appointment.js";
import Expert from "../models/Expert.js";

const appointmentRoutes = express.Router();

// Helper: Generate time slots from 9:00 AM to 5:00 PM in 30 min intervals
function generateTimeSlots() {
  const slots = [];
  let hour = 9;
  let minute = 0;

  while (hour < 17 || (hour === 17 && minute === 0)) {
    const start = new Date(0, 0, 0, hour, minute);
    const end = new Date(0, 0, 0, hour, minute + 30);

    const formatTime = (date) =>
      date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

    slots.push(`${formatTime(start)} - ${formatTime(end)}`);

    minute += 30;
    if (minute >= 60) {
      minute = 0;
      hour += 1;
    }
  }

  return slots;
}

// GET: Available time slots for a specific expert on a specific date
appointmentRoutes.get("/expert/:id/slots", async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert || !expert.available) {
      return res.status(400).json({ error: "Expert not available" });
    }

    const selectedDate = new Date(req.query.date);
    const dayStart = new Date(selectedDate);
    const dayEnd = new Date(selectedDate);
    dayStart.setHours(0, 0, 0, 0);
    dayEnd.setHours(23, 59, 59, 999);

    const existingAppointments = await Appointment.find({
      expert: req.params.id,
      date: { $gte: dayStart, $lte: dayEnd },
      status: { $ne: "rejected" },
    });

    const bookedSlots = existingAppointments.map(a => a.timeSlot);
    const availableSlots = generateTimeSlots().filter(slot => !bookedSlots.includes(slot));

    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST: Book a new appointment
appointmentRoutes.post("/", async (req, res) => {
  try {
    const { expertId, userId, date, timeSlot } = req.body;

    const selectedDate = new Date(date);
    const conflict = await Appointment.findOne({
      expert: expertId,
      date: {
        $gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
        $lte: new Date(selectedDate.setHours(23, 59, 59, 999))
      },
      timeSlot,
      status: { $ne: "rejected" }
    });

    if (conflict) {
      return res.status(400).json({ error: "This time slot is already booked" });
    }

    const newAppointment = new Appointment({
      expert: expertId,
      user: userId,
      date: new Date(date),
      timeSlot,
    });

    await newAppointment.save();
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: All appointments for a user
appointmentRoutes.get("/user/:userId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.params.userId })
      .populate("expert", "name specialization photoUrl")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT: Update appointment status (approve/reject/etc)
appointmentRoutes.put("/:id/status", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate("user", "name phone");

    if (!updated) return res.status(404).json({ error: "Appointment not found" });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET: Appointments assigned to a specific expert
appointmentRoutes.get("/expert/:expertId/requests", async (req, res) => {
  try {
    const appointments = await Appointment.find({ expert: req.params.expertId })
      .populate("user", "name phone")
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default appointmentRoutes;
