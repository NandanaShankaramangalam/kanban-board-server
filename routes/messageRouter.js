const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  fetchMessages,
  createMessage,
  chatBotAssistance,
} = require("../controller/messageController");
const checkBoardMembership = require("../middlewares/checkBoardMemberMiddleware");
const router = express.Router();

router.post("/:boardId", protect, checkBoardMembership, createMessage);
router.get("/:boardId", protect, checkBoardMembership, fetchMessages);
router.post("/ai-bot/:boardId", protect, checkBoardMembership, chatBotAssistance);
module.exports = router;
