const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findOne({ id: decoded.id }).select("-password");
      return next();
    }

    res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = { protect };
