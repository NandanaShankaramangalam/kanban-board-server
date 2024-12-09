const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  taskId: { type: String, unique: true, required: true },
  boardId: {
    type: String,
    ref: "Board",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["to_do", "in_progress", "done"],
    default: "to_do",
  },
  assigneeId: {
    type: String,
    ref: "User",
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

module.exports = mongoose.model("Task", taskSchema);
