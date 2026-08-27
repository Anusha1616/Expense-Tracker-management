const express = require("express");
const router = express.Router();

const {
  registerUser,
  login
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", login);

router.get("/profile", authMiddleware, (req, res) => {
  res.status(200).json({
    message: "You are authenticated",
    userId: req.user
  });
});

module.exports = router;