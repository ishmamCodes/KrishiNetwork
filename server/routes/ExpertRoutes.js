// routes/expertRoutes.js
import express from "express";
import multer from "multer";
import {
  expertLogin,
  expertLogout,
  getAllExperts,
  getExpert,
  toggleExpertAvailability,
  updateExpert
} from "../controllers/usercontrollers.js";

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }   // e.g. 5MB max
});

const expertRoutes = express.Router();

// Auth
expertRoutes.post("/login", expertLogin);
expertRoutes.post("/logout", expertLogout);

// Read
expertRoutes.get("/:id", getExpert);

// Update — parse multipart with `photo` field, *then* your controller
expertRoutes.put("/:id", upload.single("photo"), updateExpert);
expertRoutes.get("/", getAllExperts); 
expertRoutes.put("/toggle/:id", toggleExpertAvailability);


export default expertRoutes;