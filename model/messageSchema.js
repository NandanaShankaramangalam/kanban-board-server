const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  messageId: {
    type: String,
    unique: true,
    required: true,
  },
  boardId: {
    type: String,
    ref: "Board",
    required: true,
  },
  userId: {
    type: String,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  mentions: {
    type: [String],
  },
  isBotResponse: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Message", messageSchema);
