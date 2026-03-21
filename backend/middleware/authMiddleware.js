const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // Read the Authorization header added by the Axios interceptor on the frontend.
  const authHeader = req.headers.authorization;

  // Protected routes expect the format: Bearer <token>.
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify that the token was signed by this server and has not expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user data so controllers know which user is making the request.
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

module.exports = protect;
