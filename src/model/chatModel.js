const mongoose = require("mongoose");

// Define the chat message schema
const chatSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,  // Ensures a message is provided
    trim: true,      // Removes leading and trailing whitespace
  },
  userName: {
    type: String,
    required: true,  // Ensures a username is provided
    trim: true,
    minlength: 2,    // Minimum length for the username
  },
  timestamp: {
    type: Date,
    default: Date.now, // Defaults to the current date and time
  },
});

// Create a model from the schema
const ChatMessage = mongoose.model("ChatMessage", chatSchema);

module.exports = ChatMessage;
