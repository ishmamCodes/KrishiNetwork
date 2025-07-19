import express from "express";
import {
  sellerLogin,
  addSeller,
  addExpert,
  sellerLogout
} from "../controllers/usercontrollers.js";

const sellerRoutes = express.Router();

// Admin (Seller) routes
sellerRoutes.post("/add", addSeller);        // Optional: pre-setup or registration
sellerRoutes.post("/login", sellerLogin);
sellerRoutes.post("/logout", sellerLogout);
sellerRoutes.post("/add-expert", addExpert); // Admin adds experts

export default sellerRoutes;
