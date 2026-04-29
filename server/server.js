import express from "express";
import mongoose from "mongoose";
import cors from "cors";
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
const port = process.env.PORT || 4000; // ✅ Dynamic port for Render

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // ✅ From env variable
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === "production" } // ✅ HTTPS in prod
}));

// CORS — allow only your Vercel frontend
app.use(cors({
    origin: process.env.CLIENT_URL, // ✅ e.g. https://krishinetwork.vercel.app
    credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/users", userRoutes);
app.use("/sellers", sellerRoutes);
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
mongoose.connect(process.env.MONGO_URI) // ✅ From env variable
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log("Error connecting to MongoDB:", error));

app.get("/", (req, res) => {
    res.send("Express App is Running");
});

app.listen(port, (error) => {
    if (error) {
        console.error("Error starting the server:", error);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});