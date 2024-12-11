const Board = require("../model/boardSchema");
const User = require("../model/userSchema");
const Task = require("../model/taskSchema");
const { convertToTaskStructure } = require("../utils/utils");
const { io } = require("../index");

const generateBoardId = () => {
  return `KB-${Date.now()}`;
};
const generateTaskId = () => {
  return `TK-${Date.now()}`;
};

const createBoard = async (req, res) => {
  const { name } = req.body;
  try {
    const existingBoard = await Board.findOne({
      name,
      ownerId: req?.user?.id,
    });

    if (existingBoard) {
      return res
        .status(400)
        .json({ error: "A board with this name already exists." });
    }

    const newBoard = await Board.create({
      id: generateBoardId(),
      name,
      members: [req.user.id],
      ownerId: req.user.id,
      ownerName: req?.user?.username,
    });
    res.status(201).json(newBoard);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Failed to create board" });
  }
};

const fetchBoard = async (req, res) => {
  try {
    const boards = await Board.find({ members: { $in: [req.user.id] } });
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const fetchUsersNotInBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findOne({ id: boardId }).populate("members");

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const users = await User.find({ id: { $nin: board?.members } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addUsersToBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { users } = req.body;

    const updatedBoard = await Board.findOneAndUpdate(
      { id: boardId },
      { $addToSet: { members: { $each: users } } },
      { new: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found" });
    }

    res
      .status(200)
      .json({ message: "Users added successfully", board: updatedBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const fetchUsersInBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findOne({ id: boardId });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    const memberIds = board.members;
    const usersInBoard = await User.find({
      id: { $in: memberIds },
    });

    if (usersInBoard.length === 0) {
      return res.status(404).json({ message: "No users found in this board" });
    }
    res.status(200).json({ users: usersInBoard });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const addTask = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, column, assignee } = req.body;

    const task = await Task.create({
      taskId: generateTaskId(),
      title,
      description,
      status: column,
      assigneeId: assignee,
      boardId,
    });

    req?.io.to(boardId).emit("taskAdded", task);
    res.status(201).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating task", error });
  }
};

const fetchTasksInBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const result = await Task.find({ boardId: boardId });

    const tasks = convertToTaskStructure(result);
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating task", error });
  }
};

const updateTask = async (req, res) => {
  const { taskId, boardId } = req.params;
  const updateData = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { taskId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    req?.io.to(boardId).emit("taskUpdated", updatedTask);
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId, boardId } = req.params;
    const deletedTask = await Task.findOneAndDelete({ taskId: taskId });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    req?.io.to(boardId).emit("taskDeleted", deletedTask);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeUsersFromBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { users } = req.body;

    if (!Array.isArray(users)) {
      return res
        .status(400)
        .json({ message: "Invalid input: userIds must be an array." });
    }

    const updatedBoard = await Board.findOneAndUpdate(
      { id: boardId },
      {
        $pull: { members: { $in: users } },
      },
      { new: true }
    );

    if (!updatedBoard) {
      return res.status(404).json({ message: "Board not found." });
    }

    res
      .status(200)
      .json({ message: "Users removed successfully.", updatedBoard });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while removing users." });
  }
};

module.exports = {
  createBoard,
  fetchBoard,
  fetchUsersNotInBoard,
  addUsersToBoard,
  fetchUsersInBoard,
  addTask,
  fetchTasksInBoard,
  updateTask,
  deleteTask,
  removeUsersFromBoard,
};
