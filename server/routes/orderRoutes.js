import express from "express";
import {
  placeOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// Place a new order (Cash on Delivery)
orderRouter.post("/cod", placeOrder);

// Get all orders
orderRouter.get("/all", getAllOrders);

// Get orders for a specific user
orderRouter.get("/user/:userId", getUserOrders);

// ✅ Update order status
orderRouter.put("/:id/status", updateOrderStatus);

export default orderRouter;