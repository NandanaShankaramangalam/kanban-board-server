const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const authRouter = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:3001"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
