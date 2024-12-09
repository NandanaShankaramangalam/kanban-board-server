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
} = require("../controller/boardController");
const { protect } = require("../middlewares/authMiddleware");
const { io } = require("../index");

router.post("/", protect, createBoard);
router.get("/", protect, fetchBoard);
router.get("/:boardId/users/not-assigned", protect, fetchUsersNotInBoard);
router.post("/users/:boardId", protect, addUsersToBoard);
router.get("/:boardId/users", protect, fetchUsersInBoard);
router.post("/:boardId/add-task", protect, addTask);
router.get("/:boardId/tasks", protect, fetchTasksInBoard);
router.put("/:boardId/tasks/:taskId", protect, updateTask);
router.delete("/:boardId/tasks/:taskId", protect, deleteTask);

module.exports = router;
