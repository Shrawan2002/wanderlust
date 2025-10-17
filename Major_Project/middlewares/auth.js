const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Get token from headers
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3️⃣ Find user from decoded token
    const user = await User.findById(decoded.id).select("-password"); // omit password

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 4️⃣ Attach user to request
    req.user = user;

    // Continue to next middleware or route
    next();

  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
