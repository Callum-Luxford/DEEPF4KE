// MODULES
// server/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  console.log("Authorization Header:", req.headers.authorization); // Debug header
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (!token) {
    req.user = null; // No token, user is unauthenticated
    console.log("No token provided. req.user is null.");
    return next(); // Proceed without setting user
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Set user from token

    if (decoded) {
      req.user = decoded;
      res.locals.user = req.user; // Attach decoded user to locals
    }

    console.log("Decoded user from token:", decoded);
  } catch (error) {
    req.user = null; // Invalid token
    console.error("Error decoding token:", error.message);
  }

  next(); // Continue to the next middleware
};

module.exports = authenticateUser;
