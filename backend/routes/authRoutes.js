const express = require("express");

const router = express.Router();

const {
  registerUser,
  login,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");


// =========================
// REGISTER
// =========================

router.post("/register", registerUser);


// =========================
// LOGIN
// =========================

router.post("/login", login);


// =========================
// FORGOT PASSWORD
// Send OTP to email
// =========================

router.post(
  "/forgot-password",
  forgotPassword
);


// =========================
// VERIFY OTP
// =========================

router.post(
  "/verify-otp",
  verifyOTP
);


// =========================
// RESET PASSWORD
// =========================

router.post(
  "/reset-password",
  resetPassword
);

// =========================
// PROFILE
// =========================

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// =========================
// CHANGE PASSWORD
// =========================

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);


module.exports = router;