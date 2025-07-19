import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import cors from "cors";
import fs from "fs";
import session from "express-session";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sellerRoutes from "./routes/sellerRoutes.js";
import expertRoutes from "./routes/ExpertRoutes.js";
import productRoutes from './routes/ProductRoutes.js';
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import blogRoutes from './routes/blogRoutes.js'; 
import educationRoutes from './routes/educationRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const port = 4000;

// Session middleware setup
app.use(session({
    secret: "your_secret_key", // Change to a secure value in production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to `true` if using HTTPS
}));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/users", userRoutes); 
app.use("/sellers", sellerRoutes); // ✅ Ensure seller routes are registered
app.use("/expert", expertRoutes);
app.use('/products', productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

app.use("/api/blogs", blogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/messages', messageRoutes);

app.use('/appointments', appointmentRoutes);

// MongoDB Connection
mongoose.connect("mongodb+srv://alvisakiborin:01402864581@cluster0.l9iaiih.mongodb.net/myDatabase")
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Error connecting to MongoDB:", error));

// Routes
app.get("/", (req, res) => {
    res.send("Express App is Running");
});

// Start server
app.listen(port, (error) => {
    if (error) {
        console.error("Error starting the server:", error);
    } else {
        console.log(`Server is running on http://localhost:${port}`);
    }
});