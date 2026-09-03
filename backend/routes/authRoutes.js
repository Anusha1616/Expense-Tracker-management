const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Registration
router.post("/register", registerUser);

// Registration email OTP verification
router.post("/verify-registration-otp", verifyRegistrationOTP);
// Resend registration OTP//
router.post("/resend-registration-otp", resendRegistrationOTP);

// Login
router.post("/login", loginUser);

// Forgot password
router.post("/forgot-password", forgotPassword);
//console.log("resendPasswordOTP type:", typeof resendPasswordOTP);

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