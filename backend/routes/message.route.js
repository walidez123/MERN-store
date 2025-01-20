import express from "express";
import {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

// Create a new message
router.post("/", createMessage);

// Get all messages
router.get("/", getMessages);

// Get a single message by ID
router.get("/:id", getMessageById);

// Update a message by ID
router.put("/:id", updateMessage);

// Delete a message by ID
router.delete("/:id", deleteMessage);

export default router;