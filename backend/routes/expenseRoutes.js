const express = require("express");

const router = express.Router();

const {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
  restoreExpenses
} = require("../controllers/expenseController");

const authMiddleware = require("../middleware/authMiddleware");

// console.log("authMiddleware:", typeof authMiddleware);
// console.log("addExpense:", typeof addExpense);


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

// RESTORE
router.post(
  "/restore",
  authMiddleware,
  restoreExpenses
);

// delete all transactions  
router.delete(
  "/",
  authMiddleware,
  deleteAllExpenses
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


// Delete transaction one
router.delete(
  "/:id",
  authMiddleware,
  deleteExpense
);




module.exports = router;