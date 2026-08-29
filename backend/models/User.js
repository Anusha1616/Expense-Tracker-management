const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

  phone: {
  type: String,
  default: ""
},

    password: {
      type: String,
      required: true
    },

    // =========================
    // PASSWORD RESET OTP
    // =========================

    resetOTP: {
      type: String,
      default: null
    },

    resetOTPExpiry: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    collection: "users111"
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;