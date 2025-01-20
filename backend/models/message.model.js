import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    name: { type: String, required: true }, // Name of the sender
    email: { type: String, required: true }, // Email of the sender
    message: { type: String, required: true }, // Message content
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Message = mongoose.model("Message", messageSchema);
export default Message;