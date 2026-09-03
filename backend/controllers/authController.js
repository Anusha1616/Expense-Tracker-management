const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const transporter = require("../config/mail");
const PendingUser = require("../models/PendingUser");

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

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 1 minute
    const otpExpiry = Date.now() + 1 * 60 * 1000;

    // Hash password before temporarily storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Remove any previous pending registration
    await PendingUser.deleteOne({ email });

    // Store registration details temporarily
    await PendingUser.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry
    });

    // Send OTP to email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Expense Tracker - Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          
          <h2>💰 Expense Tracker</h2>

          <p>Hello ${name},</p>

          <p>
            Thank you for creating an Expense Tracker account.
          </p>

          <p>
            Your email verification OTP is:
          </p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>
            This OTP will expire in <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not request this account, please ignore this email.
          </p>

        </div>
      `
    });

    // Account is NOT created yet
    res.status(200).json({
      message: "OTP sent successfully. Please verify your email."
    });

  } catch (error) {
    console.error("Registration OTP Error:", error);

    res.status(500).json({
      message: "Unable to send verification OTP"
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

// Hash OTP before storing it
const hashedOTP = await bcrypt.hash(otp, 10);

// Store hashed OTP temporarily
user.resetOTP = hashedOTP;
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
// RESEND PASSWORD RESET OTP
// =========================

const resendPasswordOTP = async (req, res) => {
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

    // Generate new 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 5 minutes
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    // Hash OTP before storing
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Store new OTP
    user.resetOTP = hashedOTP;
    user.resetOTPExpiry = otpExpiry;

    // Reset verification status
    user.resetOTPVerified = false;

    await user.save();

    // Send new OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Expense Tracker - New Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">

          <h2>💰 Expense Tracker</h2>

          <p>You requested a new password reset OTP.</p>

          <p>Your new OTP is:</p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>
            This OTP will expire in <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not request this OTP, please ignore this email.
          </p>

        </div>
      `
    });

    res.status(200).json({
      message: "New OTP sent successfully"
    });

  } catch (error) {
    console.error(
      "Resend Password OTP Error:",
      error
    );

    res.status(500).json({
      message: "Unable to resend OTP"
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
// Compare entered OTP with hashed OTP
// Compare entered OTP with hashed OTP
const isOTPMatch = await bcrypt.compare(
  otp,
  user.resetOTP
);

if (!isOTPMatch) {
  return res.status(400).json({
    message: "Invalid OTP"
  });
}

// Mark OTP as verified
user.resetOTPVerified = true;

await user.save();

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
    // Compare entered OTP with hashed OTP
const isOTPMatch = await bcrypt.compare(
  otp,
  user.resetOTP
);

if (!isOTPMatch) {
  return res.status(400).json({
    message: "Invalid OTP"
  });
}

// Check whether OTP was verified first
if (!user.resetOTPVerified) {
  return res.status(400).json({
    message: "Please verify OTP first"
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
   // Remove OTP after successful password reset
user.resetOTP = undefined;
user.resetOTPExpiry = undefined;
user.resetOTPVerified = false;

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
// VERIFY REGISTRATION OTP
// =========================

const verifyRegistrationOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check fields
    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required"
      });
    }

    // Find pending registration
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        message: "Registration not found. Please register again."
      });
    }

    // Check OTP expiry
    if (Date.now() > pendingUser.otpExpiry) {
      await PendingUser.deleteOne({ email });

      return res.status(400).json({
        message: "OTP has expired. Please register again."
      });
    }

    // Check OTP
    if (pendingUser.otp !== otp) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    // Create actual user account
    const user = await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password
    });

    // Delete temporary registration
    await PendingUser.deleteOne({ email });

    // Success response
    res.status(201).json({
      message: "Email verified and account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Registration OTP verification error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// =========================
// RESEND REGISTRATION OTP
// =========================

const resendRegistrationOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    // Find pending registration
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return res.status(404).json({
        message: "Registration not found. Please register again."
      });
    }

    // Generate new 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP expires after 1 minute
    const otpExpiry = Date.now() + 1 * 60 * 1000;

    // Update pending user
    pendingUser.otp = otp;
    pendingUser.otpExpiry = otpExpiry;

    await pendingUser.save();

    // Send new OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Expense Tracker - New Email Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">

          <h2>💰 Expense Tracker</h2>

          <p>Hello ${pendingUser.name},</p>

          <p>
            Your new email verification OTP is:
          </p>

          <h1 style="letter-spacing: 5px;">
            ${otp}
          </h1>

          <p>
            This OTP will expire in <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not request this OTP, please ignore this email.
          </p>

        </div>
      `
    });

    res.status(200).json({
      message: "New OTP sent successfully."
    });

  } catch (error) {
    console.error("Resend registration OTP error:", error);

    res.status(500).json({
      message: "Unable to resend OTP"
    });
  }
};
// =========================
// LOGIN USER
// =========================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Compare password with hashed password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // Send successful response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      message: "Server error during login"
    });
  }
};
// =========================
// EXPORT
// =========================
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resendPasswordOTP,
  verifyOTP,
  resetPassword,
  verifyRegistrationOTP,
  resendRegistrationOTP
};