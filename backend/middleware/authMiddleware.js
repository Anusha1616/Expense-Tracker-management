const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {

    // Get Authorization header
    const authHeader = req.headers.authorization;

    // Check token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided"
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Store logged-in user's ID
    req.userId = decoded.userId;

    console.log("Authenticated User ID:", req.userId);

    // Continue
    next();

  } catch (error) {

    console.error("Authentication Error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;