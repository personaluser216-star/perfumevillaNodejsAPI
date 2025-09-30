const JWT = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = JWT.sign(
        { email }, // 👈 payload
        process.env.JWT_SECRETKEY,
        { expiresIn: "1h" } // 👈 optional expiry
      );

      return res.json({ success: true, token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

module.exports = { adminLogin };
