const jwt = require("jsonwebtoken");
const axios = require("axios");

const User = require("../../models/User");
const { sendMessage } = require("../../broker/index");

/**
 * User login with Google OAuth.
 *
 * If the account doesn't already exist, it is automatically created.
 *
 * @param {string?} req.body.accessToken Access token returned from OAuth
 *
 * @returns Message about success or failure along with the cookie that contains user's JWT (in case of success)
 */
exports.googleLogin = async (req, res) => {
  const { accessToken } = req.body;
  try {
    // Verify Google access token by calling Google's Token Info API
    const tokenInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
    );

    const { email, sub: googleId } = tokenInfo.data;

    // Now fetch the user's profile information
    const userInfo = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`
    );
    const { name } = userInfo.data;

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      if (!user.isGoogleUser) {
        return res.status(400).json({
          message: "This email is already associated with a regular account.",
        });
      }
    } else {
      // Create a new user if not exists
      user = new User({
        name: name || "Google User",
        email,
        googleId,
        isGoogleUser: true,
      });
      await user.save();
      await sendMessage("user-created", {
        id: user._id.toHexString(),
        name,
      });
    }

    // Generate a JWT token
    const payload = {
      user: {
        id: user._id.toHexString(),
        isAdmin: user.isAdmin,
      },
    };

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
      maxAge: 2592000000, // 30 days
    });

    return res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Google Login Error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong. Please try again later." });
  }
};
