
import express from "express";
import { updateCart } from "../controllers/cartController.js";
import { getUserById } from "../controllers/usercontrollers.js";

const cartRoutes = express.Router();

cartRoutes.post("/update", getUserById, updateCart); // ✅ Secure cart update route

export default cartRoutes;
