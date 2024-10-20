const jwt = require("jsonwebtoken");

module.exports = async function authorizeUser(req, res, next) {
  // Extract the JWT from the "token" cookie
  const token = req.cookies?.token;

  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this page" });
  }

  try {
    const secret = process.env.JWT_SECRET || "secret";
    const decoded = jwt.verify(token, secret);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "You are not authorized to access this page" });
  }
};
