const { io } = require("../index");
const Task = require("../model/taskSchema");

const setupSocketIO = (io) => {
  io.on("connection", (socket) => {
    console.log("user connected to socket...");
    socket.on("joinBoard", (boardId) => {
      console.log("socket boardId: ", boardId);

      socket.join(boardId);
      console.log(`User ${socket.id} joined board ${boardId}`);
    });

    socket.on("taskDragged", async (data) => {
      const { source, destination, tasks, boardId, movedTask } = data;
      try {
        const updatedTask = await Task.findOneAndUpdate(
          { taskId: movedTask?.taskId },
          {
            status: destination?.droppableId,
          },
          { new: true }
        );

        io.to(boardId).emit("taskMoved", tasks);
      } catch (error) {
        console.error("Error updating task status in database:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};

module.exports = { setupSocketIO };
