const Board = require("../model/boardSchema");

const checkBoardMembership = async (req, res, next) => {
  const { boardId } = req.params;
  const userId = req.user.id;

  try {
    const board = await Board.findOne({ id: boardId });

    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if (!board.members.includes(userId)) {
      return res
        .status(403)
        .json({ message: "Access denied. User is not a member of the board" });
    }

    next();
  } catch (error) {
    console.error("Error checking board membership:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkBoardMembership;
