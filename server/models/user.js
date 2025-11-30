import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: String,
    email: String,
    picture: String,
    customPicture: String,
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date
});

export default mongoose.model("User", userSchema);
