import jwt from "jsonwebtoken";

/**
 * Middleware function to authenticate a user, getting the access token from cookie
 * with name "token"
 *
 * If authentication is successful, continue to endpoint (next)
 * Otherwise send error status (401 - Not authorized)
 */
export const authorizeUser = async (req, res, next) => {
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
