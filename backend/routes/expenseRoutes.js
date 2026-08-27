const express = require("express");

const router = express.Router();

const {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");


// =====================================================
// EXPENSE ROUTES
// =====================================================

// Add transaction
router.post(
  "/",
  authMiddleware,
  addExpense
);


// Get all transactions
router.get(
  "/",
  authMiddleware,
  getExpenses
);


// Get single transaction
router.get(
  "/:id",
  authMiddleware,
  getExpenseById
);


// Update transaction
router.put(
  "/:id",
  authMiddleware,
  updateExpense
);


// Delete transaction
router.delete(
  "/:id",
  authMiddleware,
  deleteExpense
);


module.exports = router;