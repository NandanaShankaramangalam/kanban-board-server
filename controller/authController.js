const User = require("../model/userSchema");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password: passwordHash } = req.body;

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      res.status(400).json({ message: "User with this email already exists" });
      return;
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      res.status(400).json({ message: "Username is already taken" });
      return;
    }

    const uniqueId = `UX-${Date.now()}${Math.floor(
      1000000000 + Math.random() * 9000000000
    )}`.slice(0, 15);

    const user = await User.create({
      id: uniqueId,
      username,
      email,
      passwordHash,
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user.id),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        token: generateToken(user.id),
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong! Please try agin later.",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
