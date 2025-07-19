import mongoose from "mongoose";
import User from "../models/User.js";
import Seller from "../models/Seller.js";
import Expert from "../models/Expert.js";

// Signup (Farmer)
export const signup = async (req, res) => {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
        return res.status(400).json({ error: "Name, phone, and password are required" });
    }

    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }

        const newUser = new User({
            name,
            phone,
            password,
            role: "farmer",
        });

        await newUser.save();
        res.status(201).json({ message: "Signup successful", user: newUser });
    } catch (err) {
        res.status(500).json({ error: "Signup failed", details: err.message });
    }
};

// Farmer Login
export const login = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ error: "Phone and password are required" });
    }

    try {
        const user = await User.findOne({ phone });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.status(200).json({
            message: "Login successful",
            user: {
                _id: user._id, // ✅ fixed here
                name: user.name,
                phone: user.phone,
                role: user.role,
            },
        });
    } catch (err) {
        res.status(500).json({ error: "Login failed", details: err.message });
    }
};

// Add Seller
export const addSeller = async (req, res) => {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
        return res.status(400).json({ error: "Name, phone, and password are required" });
    }

    try {
        const existingSeller = await Seller.findOne({ phone });
        if (existingSeller) {
            return res.status(409).json({ error: "Seller already exists" });
        }

        const newSeller = new Seller({ name, phone, password });
        await newSeller.save();

        res.status(201).json({ message: "Seller added successfully", seller: newSeller });
    } catch (error) {
        res.status(500).json({ error: "Failed to add seller", details: error.message });
    }
};

// Seller Login
export const sellerLogin = async (req, res) => {
    const { phone, password } = req.body;
    const seller = await Seller.findOne({ phone });

    if (!seller || seller.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
        message: "Seller logged in successfully",
        seller: {
            _id: seller._id, // ✅ consistent
            name: seller.name,
            phone: seller.phone,
        },
    });
};

// Expert Login
export const expertLogin = async (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ error: "Phone and password are required" });
    }

    const expert = await Expert.findOne({ phone });

    if (!expert || expert.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({
        message: "Expert logged in successfully",
        expert: {
            _id: expert._id,
            name: expert.name,
            phone: expert.phone,
            specialization: expert.specialization,
            addedBy: expert.addedBy,
            role: "expert" // 🔥 Ensure frontend recognizes expert login properly
        },
    });
};

// Add Expert by Seller
export const addExpert = async (req, res) => {
    const { sellerId, name, phone, specialization, password } = req.body;

    if (!sellerId || !name || !phone || !specialization || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const sellerExists = await Seller.findById(sellerId);
        if (!sellerExists) {
            return res.status(404).json({ error: "Seller not found" });
        }

        const expertExists = await Expert.findOne({ phone });
        if (expertExists) {
            return res.status(409).json({ error: "Expert already exists" });
        }

        const newExpert = new Expert({
            name,
            phone,
            specialization,
            password,
            addedBy: sellerId,
        });

        await newExpert.save();

        res.status(201).json({ message: "Expert added successfully", expert: newExpert });
    } catch (error) {
        console.error("Add Expert Error:", error);
        res.status(500).json({ error: "Failed to add expert", details: error.message });
    }
};

// Get User by ID
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID format" });
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: "Failed to get user", details: err.message });
    }
};

// Get Expert by ID
export const getExpert = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid expert ID" });
    }

    const expert = await Expert.findById(id).select("-password");
    if (!expert) return res.status(404).json({ error: "Expert not found" });

    return res.json(expert);
};

// Update Expert
export const updateExpert = async (req, res) => {
    const { id } = req.params;
    // req.body is now defined (text fields), and req.file is your image if provided
    const { name, specialization, description, password } = req.body;
  
    // build the update object
    const update = { name, specialization, description };
    if (password) update.password = password;
  
    // if multer gave you a file, process it (e.g. save to disk or S3)
    if (req.file) {
      // example: convert buffer to Base64
      update.photoUrl =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
    }
  
    try {
      const expert = await Expert.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      }).select("-password");
  
      if (!expert) {
        return res.status(404).json({ error: "Expert not found" });
      }
  
      return res.json(expert);
    } catch (err) {
      return res.status(500).json({ error: "Update failed", details: err.message });
    }
  };
// Update User
export const updateUserProfile = async (req, res) => {
    const { id } = req.params;
    const { name, phone } = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, phone },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to update user", details: error.message });
    }
};

// Logout for all roles
export const logout = async (req, res) => {
    if (!req.session) {
        return res.status(400).json({ error: "Session not found" });
    }

    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: "Logout failed" });
        } else {
            res.status(200).json({ message: "Logout successful" });
        }
    });
};
export const getAllExperts = async (req, res) => {
    try {
      const experts = await Expert.find({}, '-password -__v').populate('addedBy', 'name');
      res.status(200).json(experts);
    } catch (error) {
      console.error("Failed to fetch experts:", error.message);
      res.status(500).json({ error: "Failed to fetch experts." });
    }
  };
  
export const toggleExpertAvailability = async (req, res) => {
    try {
      const expert = await Expert.findById(req.params.id);
      if (!expert) return res.status(404).json({ error: 'Expert not found' });
  
      expert.available = !expert.available;
      await expert.save();
      res.status(200).json(expert);
    } catch (error) {
      console.error("Failed to toggle availability:", error.message);
      res.status(500).json({ error: "Failed to toggle availability." });
    }
  };

export const sellerLogout = logout;
export const expertLogout = logout;