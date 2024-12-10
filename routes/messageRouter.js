const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  fetchMessages,
  createMessage,
  chatBotAssistance,
} = require("../controller/messageController");
const router = express.Router();

router.post("/:boardId", protect, createMessage);
router.get("/:boardId", protect, fetchMessages);
router.post("/ai-bot/:boardId", protect, chatBotAssistance);
module.exports = router;
