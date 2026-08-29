const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    type: {
      type: String,
      enum: ["Expense", "Income"],
      default: "Expense"
    },

    category: {
      type: String,
      default: "Other"
    },

    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "UPI",
        "Debit Card",
        "Credit Card",
        "Bank Transfer"
      ],
      default: "Cash"
    },

    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Expense",
  expenseSchema
);