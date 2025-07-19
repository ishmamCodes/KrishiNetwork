import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer'], required: true },
  date: { type: Date, default: Date.now },
  cartItems: { type: Object, default: {} }
}, { minimize: false });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
