const bcrypt = require("bcryptjs");

const User = require("../../models/User");
const { sendMessage } = require("../../broker/index");

/**
 * User sign-up with email & password.
 * @param {string?} req.body.name Username
 * @param {string?} req.body.email User's email address
 * @param {string?} req.body.password User's password
 *
 * @returns Message about success or failure
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();
    await sendMessage("user-created", {
      id: user._id.toHexString(),
      name,
    });

    return res.status(200).json({ message: "Account created successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
