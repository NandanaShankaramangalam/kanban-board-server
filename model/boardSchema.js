const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  columns: {
    type: Map,
    of: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    default: { to_do: [], in_progress: [], done: [] },
  },
  members: [{ type: String, required: true }],
  ownerId: {
    type: String,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Board", BoardSchema);
