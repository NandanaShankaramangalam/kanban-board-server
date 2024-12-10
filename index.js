const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const authRouter = require("./routes/authRoutes");
const boardRouter = require("./routes/boardRoutes");
const messageRouter = require("./routes/messageRouter");
const { setupSocketIO } = require("./socket/socketHandler");

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server);

connectDB();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3001", process.env.REACT_APP_CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    optionSuccessStatus: 200,
  })
);

const attachIoToRequest = (req, res, next) => {
  req.io = io;
  next();
};
app.use(attachIoToRequest);

app.use("/api/auth", authRouter);
app.use("/api/board", boardRouter);
app.use("/api/messages", messageRouter);

setupSocketIO(io);
module.exports = { io };

server.listen(PORT, () => {
  console.log(`Server is running on ${process.env.REACT_APP_CLIENT_URL}`);
});
