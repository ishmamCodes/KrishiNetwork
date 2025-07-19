import mongoose from "mongoose";

const SellerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Consider bcrypt for security
});

export default mongoose.model("Seller", SellerSchema);
