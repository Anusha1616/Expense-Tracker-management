const express = require("express");

const router = express.Router();

const {
  setBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
  deleteAllBudgets,
  restoreBudgets
} = require("../controllers/budgetController");

const authMiddleware = require("../middleware/authMiddleware");

// =====================================================
// ADD / SET BUDGET
// =====================================================

router.post(
  "/",
  authMiddleware,
  setBudget
);

// =====================================================
// GET ALL BUDGETS
// =====================================================

router.get(
  "/",
  authMiddleware,
  getBudgets
);

// =====================================================
// UPDATE BUDGET BY ID
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  updateBudget
);

// =====================================================
// DELETE SINGLE BUDGET BY ID
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  deleteBudget
);

// =====================================================
// DELETE ALL BUDGETS
// =====================================================

router.delete(
  "/",
  authMiddleware,
  deleteAllBudgets
);

// =====================================================
// RESTORE BUDGETS
// =====================================================

router.post(
  "/restore",
  authMiddleware,
  restoreBudgets
);

module.exports = router;