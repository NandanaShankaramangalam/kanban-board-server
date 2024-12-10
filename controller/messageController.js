const Message = require("../model/messageSchema");
const User = require("../model/userSchema");
const Task = require("../model/taskSchema");
const axios = require("axios");

const createMessage = async (req, res) => {
  const { boardId, message, mentions } = req.body;
  const userId = req?.user?.id;

  try {
    const username = req?.user?.username || "Unknown User";
    const messageId = `MSG-${Date.now()}`;
    const newMessage = new Message({
      messageId,
      boardId,
      userId,
      username,
      message,
      mentions,
    });

    await newMessage.save();
    req.io.to(boardId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ message: "Failed to create message" });
  }
};

const fetchMessages = async (req, res) => {
  const { boardId } = req.params;

  try {
    const messages = await Message.find({ boardId });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

const chatBotAssistance = async (req, res) => {
  try {
    const { boardId } = req.params;
    const userId = "BOT-0001",
      username = "AI Bot";

    const tasks = await Task.find({ boardId });

    const pendingTasks = tasks.filter((task) => task.status === "to_do");
    const inProgressTasks = tasks.filter(
      (task) => task.status === "in_progress"
    );
    const doneTasks = tasks.filter((task) => task.status === "done");

    const pendingTaskList = pendingTasks
      .map((task) => `- ${task.title}`)
      .join("\n");
    const inProgressTaskList = inProgressTasks
      .map((task) => `- ${task.title}`)
      .join("\n");
    const doneTaskList = doneTasks.map((task) => `- ${task.title}`).join("\n");

    const prompt = `
  Provide a summary of the current board's tasks in a detailed format:
  - If there are no tasks in any of the sections (To Do, In Progress, Done), state clearly that there are no tasks and provide an overview.
  - If tasks are present, list them in their respective sections:
    - Tasks in "To Do" with their titles.
    - Tasks in "In Progress" with their titles.
    - Tasks in "Done" with their titles.
  - Include an overview summarizing the number of tasks in each section in the format:
    "Overview: X tasks in To Do, Y in Progress, Z in Done."

  Example format:
  "Tasks in To Do:
  - Bug fix
  - UI enhancement
  Tasks in Progress:
  - Loader issue
  - Database optimization
  Tasks Done:
  - Code refactoring
  Overview: 2 tasks in To Do, 2 in Progress, 1 done."

  If there are no tasks, reply:
  "There are no tasks currently on the board.
  Overview: 0 tasks in To Do, 0 in Progress, 0 in Done."

  Ensure that you list tasks only if they exist in each section.
`;

    const formattedPendingTasks = pendingTaskList
      ? `Pending tasks in To Do:\n${pendingTaskList}`
      : "No tasks in To Do";
    const formattedInProgressTasks = inProgressTaskList
      ? `In Progress tasks:\n${inProgressTaskList}`
      : "No tasks in Progress";
    const formattedDoneTasks = doneTaskList
      ? `Completed tasks:\n${doneTaskList}`
      : "No tasks in Done";

    const userMessage = `${prompt}\n\n${formattedPendingTasks}\n\n${formattedInProgressTasks}\n\n${formattedDoneTasks}`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that provides task summaries and task lists.",
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const aiReply = response.data.choices[0].message.content.trim();

    const messageDoc = new Message({
      messageId: `MSG-${Date.now()}`,
      boardId,
      userId,
      username,
      message: aiReply,
      mentions: [username],
      isBotResponse: true,
      timestamp: new Date(),
    });

    await messageDoc.save();
    req.io.to(boardId).emit("newMessage", messageDoc);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).send("Error processing AI request");
  }
};

module.exports = {
  fetchMessages,
  createMessage,
  chatBotAssistance,
};
