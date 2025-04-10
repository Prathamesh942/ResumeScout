const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);

    res.status(401).json({ message: "Invalid token" });
  }
};

const verifyEmployer = (req, res, next) => {
  if (req.user.role !== "employer")
    return res.status(403).json({ message: "Access denied" });

  next();
};

const verifyCandidate = (req, res, next) => {
  if (req.user.role !== "candidate")
    return res.status(403).json({ message: "Access denied" });
  next();
};

module.exports = { verifyToken, verifyEmployer, verifyCandidate };
