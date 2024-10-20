const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

/**
 * User login with email & password.
 * @param {string?} req.body.email User's email address
 * @param {string?} req.body.password User's password
 *
 * @returns Message about success or failure along with the cookie that contains user's JWT (in case of success)
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate inputs
    if (!email || email === "") {
      return res
        .status(400)
        .json({ message: "Invalid parameters: Email address is required" });
    }

    if (!password || password === "") {
      return res
        .status(400)
        .json({ message: "Invalid parameters: Password is required" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    if (user.isDeleted) {
      return res.status(400).json({
        message:
          "Your account has been deleted. It can only be restored by an administrator",
      });
    }

    const payload = {
      user: {
        id: user._id.toHexString(),
        isAdmin: user.isAdmin,
      },
    };

    // Generate the JSON web token
    const secret = process.env.JWT_SECRET || "secret";
    const token = jwt.sign(
      payload,
      secret,
      { expiresIn: 2592000 } // 2592000 seconds = 30 days
    );

    // Set the cookie in the response
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 2592000000, // 2592000000 milliseconds = 30 days
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({
      message: `Something went wrong. Please try again later. (${err})`,
    });
  }
};
