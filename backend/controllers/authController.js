const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../config/mail");

// =========================
// REGISTER USER
// =========================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please enter all fields"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =========================
// LOGIN USER
// =========================

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email and password
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // Create JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // Send response
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =========================
// GET USER PROFILE
// =========================

const getProfile = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const user = await User.findById(req.userId)
      .select("-password -resetOTP -resetOTPExpiry");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || ""
      }
    });

  } catch (error) {

    console.error(
      "Get Profile Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =========================
// UPDATE USER PROFILE
// =========================

const updateProfile = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const {
      name,
      email,
      phone
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check whether another account already uses this email
    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.userId }
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered"
      });
    }

    user.name = name;
    user.email = email;
    user.phone = phone || "";

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {

    console.error(
      "Update Profile Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};

// =========================
// CHANGE PASSWORD
// =========================

const changePassword = async (req, res) => {
  try {

    // Check authenticated user
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const {
      currentPassword,
      newPassword
    } = req.body;

    // Check fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message:
          "Current password and new password are required"
      });
    }

    // Check password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "New password must contain at least 6 characters"
      });
    }

    // Find logged-in user
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // Save new password
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message:
        "Password changed successfully"
    });

  } catch (error) {

    console.error(
      "Change Password Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};

// =========================
// FORGOT PASSWORD - SEND OTP
// =========================

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 5 minutes
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // Store OTP temporarily
    user.resetOTP = otp;
    user.resetOTPExpiry = otpExpiry;

    await user.save();

    // Send OTP email
    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      subject: "Expense Tracker - Password Reset OTP",

      html: `
        <div style="font-family: Arial, sans-serif;">

          <h2>💰 Expense Tracker</h2>

          <p>
            You requested to reset your password.
          </p>

          <p>
            Your OTP is:
          </p>

          <h1>
            ${otp}
          </h1>

          <p>
            This OTP will expire in 5 minutes.
          </p>

          <p>
            If you did not request this,
            please ignore this email.
          </p>

        </div>
      `
    });

    res.status(200).json({
      message: "OTP sent successfully"
    });

  } catch (error) {

    console.error("OTP Error:", error);

    res.status(500).json({
      message: "Unable to send OTP"
    });
  }
};


// =========================
// VERIFY OTP
// =========================

const verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    // Check fields
    if (!email || !otp) {

      return res.status(400).json({
        message: "Email and OTP are required"
      });

    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // Check whether OTP exists
    if (!user.resetOTP) {

      return res.status(400).json({
        message: "No OTP requested"
      });

    }

    // Check expiry
    if (Date.now() > user.resetOTPExpiry) {

      user.resetOTP = undefined;
      user.resetOTPExpiry = undefined;

      await user.save();

      return res.status(400).json({
        message: "OTP has expired"
      });

    }

    // Compare OTP
    if (user.resetOTP !== otp) {

      return res.status(400).json({
        message: "Invalid OTP"
      });

    }

    // OTP is correct
    res.status(200).json({
      message: "OTP verified successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


// =========================
// RESET PASSWORD
// =========================

const resetPassword = async (req, res) => {

  try {

    const {
      email,
      otp,
      newPassword
    } = req.body;

    // Check fields
    if (!email || !otp || !newPassword) {

      return res.status(400).json({
        message:
          "Email, OTP and new password are required"
      });

    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        message: "User not found"
      });

    }

    // Check OTP
    if (user.resetOTP !== otp) {

      return res.status(400).json({
        message: "Invalid OTP"
      });

    }

    // Check expiry
    if (
      !user.resetOTPExpiry ||
      Date.now() > user.resetOTPExpiry
    ) {

      return res.status(400).json({
        message: "OTP has expired"
      });

    }

    // Check password length
    if (newPassword.length < 6) {

      return res.status(400).json({
        message:
          "Password must be at least 6 characters"
      });

    }

    // Hash new password
    const hashedPassword =
      await bcrypt.hash(newPassword, 10);

    // Update password
    user.password = hashedPassword;

    // Remove OTP
    user.resetOTP = undefined;
    user.resetOTPExpiry = undefined;

    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }
};


// =========================
// EXPORT
// =========================
module.exports = {
  registerUser,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
};