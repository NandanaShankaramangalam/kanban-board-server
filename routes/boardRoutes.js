const express = require("express");
const router = express.Router();
const {
  createBoard,
  fetchBoard,
  addUsersToBoard,
  fetchUsersNotInBoard,
  fetchUsersInBoard,
  addTask,
  fetchTasksInBoard,
  updateTask,
  deleteTask,
  removeUsersFromBoard,
} = require("../controller/boardController");
const { protect } = require("../middlewares/authMiddleware");
const { io } = require("../index");
const checkBoardMembership = require("../middlewares/checkBoardMemberMiddleware");

router.post("/", protect, createBoard);
router.get("/", protect, fetchBoard);
router.get("/:boardId/users/not-assigned", protect, checkBoardMembership, fetchUsersNotInBoard);
router.post("/add-users/:boardId", protect, checkBoardMembership, addUsersToBoard);
router.post("/remove-users/:boardId", protect, checkBoardMembership, removeUsersFromBoard);
router.get("/:boardId/users", protect, checkBoardMembership, fetchUsersInBoard);
router.post("/:boardId/add-task", protect, checkBoardMembership, addTask);
router.get("/:boardId/tasks", protect, checkBoardMembership, fetchTasksInBoard);
router.put("/:boardId/tasks/:taskId", protect, checkBoardMembership, updateTask);
router.delete("/:boardId/tasks/:taskId", protect,checkBoardMembership, deleteTask);

module.exports = router;
