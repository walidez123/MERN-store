import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  cart: { 
    type: Schema.Types.ObjectId, 
    ref: "Cart" 
  }, 
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false, // New users are not verified by default
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpires: {
    type: Date,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpires: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
userSchema.add({
  favorites: [{ type: Schema.Types.ObjectId, ref: "Product" }], // Array of favorite products
});

// Add a pre-save middleware to update the `updatedAt` field
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

export default User;
