const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No authorization token provided" });
  }

  // Support both raw token and "Bearer <token>" format
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "prephub_super_secret_key_2026");
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

module.exports = verifyToken;
