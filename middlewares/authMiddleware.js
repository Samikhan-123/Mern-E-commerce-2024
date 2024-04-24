import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ success: false, message: "Token not provided" });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in requireSignIn middleware:", error);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role !== 1) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    next();
  } catch (error) {
    console.error("Error in isAdmin middleware:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
