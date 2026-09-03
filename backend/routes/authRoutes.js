const express = require("express");
const router = express.Router();

const {
  registerUser,
  login,
  forgotPassword,
  resendPasswordOTP,
  verifyOTP,
  verifyRegistrationOTP,
  resendRegistrationOTP,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Registration
router.post("/register", registerUser);

// Registration email OTP verification
router.post("/verify-registration-otp", verifyRegistrationOTP);
// Resend registration OTP//
router.post("/resend-registration-otp", resendRegistrationOTP);

// Login
router.post("/login", login);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Resend password reset OTP
router.post(
  "/resend-password-otp",
  resendPasswordOTP
);

// Forgot password OTP verification
router.post("/verify-otp", verifyOTP);

// Reset password
router.post("/reset-password", resetPassword);

// Profile
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Change password
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;