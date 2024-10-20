/**
 * User logout - Force expire the user's cookie
 *
 * @returns Success message along with the expired cookie
 */
exports.logout = (req, res) => {
  // Set the cookie in the response
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 0,
  });
  return res.status(200).json({ message: "Logout successful" });
};
