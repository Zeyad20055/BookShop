const jwt = require("jsonwebtoken");

const auth = (requiredRole = null) => {
  return (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Access denied! No token provided",
      });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Access denied! Invalid token",
        });
      }

      // 👇 أضف هذه الأسطر
      console.log("========== JWT ==========");
      console.log("Decoded:", decoded);
      console.log("Required Role:", requiredRole);
      console.log("=========================");

      req.user = decoded;

      if (requiredRole && decoded.role !== requiredRole) {
        console.log("❌ Access Denied");
        console.log("User Role:", decoded.role);

        return res.status(403).json({
          message: "Access denied! You are not authorized",
        });
      }

      console.log("✅ Access Granted");

      next();
    });
  };
};

const cookAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Access denied! Invalid token",
    });
  }
};

module.exports = { auth, cookAuth };