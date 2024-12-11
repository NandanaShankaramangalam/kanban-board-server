const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  members: [{ type: String, required: true }],
  ownerId: {
    type: String,
    ref: "User",
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Board", BoardSchema);
