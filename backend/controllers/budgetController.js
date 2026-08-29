const Budget = require("../models/Budget");


// =====================================================
// ADD / UPDATE BUDGET
// =====================================================

const setBudget = async (req, res) => {
  try {

    // Check authenticated user
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const { month, amount } = req.body;

    // Check required fields
    if (!month || amount === undefined) {
      return res.status(400).json({
        message: "Month and amount are required"
      });
    }

    const budgetAmount = Number(amount);

    // Validate amount
    if (
      Number.isNaN(budgetAmount) ||
      budgetAmount <= 0
    ) {
      return res.status(400).json({
        message: "Please enter a valid budget amount"
      });
    }

    // Find existing budget for this user and month
    let budget = await Budget.findOne({
      userId: req.userId,
      month
    });

    // If budget already exists → update it
    if (budget) {

      budget.amount = budgetAmount;

      await budget.save();

    } else {

      // Otherwise create new budget
      budget = await Budget.create({
        userId: req.userId,
        month,
        amount: budgetAmount
      });

    }

    res.status(200).json({

      message: "Budget saved successfully",

      budget: {
        id: budget._id,
        month: budget.month,
        amount: budget.amount
      }

    });

  } catch (error) {

    console.error(
      "Set Budget Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }
};


// =====================================================
// GET ALL USER BUDGETS
// =====================================================

const getBudgets = async (req, res) => {
  try {

    // Check authenticated user
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const budgets = await Budget.find({
      userId: req.userId
    }).sort({
      month: -1
    });

    res.status(200).json({

      budgets: budgets.map((budget) => ({
        id: budget._id,
        month: budget.month,
        amount: budget.amount
      }))

    });

  } catch (error) {

    console.error(
      "Get Budgets Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }
};


// =====================================================
// UPDATE BUDGET
// =====================================================

const updateBudget = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const { amount } = req.body;

    if (amount === undefined) {
      return res.status(400).json({
        message: "Amount is required"
      });
    }

    const budgetAmount = Number(amount);

    if (
      Number.isNaN(budgetAmount) ||
      budgetAmount <= 0
    ) {
      return res.status(400).json({
        message: "Please enter a valid budget amount"
      });
    }

     
    console.log("UPDATE PARAMS:", req.params);
    console.log("UPDATE USER:", req.userId);

    const budget = await Budget.findOne({
  _id: req.params.id,
  userId: req.userId
}); 


    console.log("FOUND BUDGET:", budget);

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found"
      });
    }

    budget.amount = budgetAmount;

    await budget.save();

    res.status(200).json({

      message: "Budget updated successfully",

      budget: {
        id: budget._id,
        month: budget.month,
        amount: budget.amount
      }

    });

  } catch (error) {

    console.error(
      "Update Budget Error:",
      error
    );

    res.status(500).json({
      message: error.message || "Server error"
    });

  }
};

// =====================================================
// DELETE ONE BUDGET
// =====================================================

// =====================================================
// DELETE ONE BUDGET
// =====================================================

const deleteBudget = async (req, res) => {
  try {

    // Check authenticated user
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    console.log("DELETE PARAMS:", req.params);
    console.log("DELETE USER:", req.userId);

    // Find budget using MongoDB ID
    const budget = await Budget.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    console.log("FOUND DELETE BUDGET:", budget);

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found"
      });
    }

    // Delete budget
    await Budget.deleteOne({
      _id: req.params.id,
      userId: req.userId
    });

    res.status(200).json({
      message: "Budget deleted successfully"
    });

  } catch (error) {

    console.error(
      "Delete Budget Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};
// =====================================================
// DELETE ALL USER BUDGETS
// =====================================================

const deleteAllBudgets = async (req, res) => {
  try {

    // Check authenticated user
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const result = await Budget.deleteMany({
      userId: req.userId
    });

    res.status(200).json({

      message: "All budgets deleted successfully",

      deletedCount: result.deletedCount

    });

  } catch (error) {

    console.error(
      "Delete All Budgets Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });

  }
};

// =====================================================
// RESTORE MULTIPLE BUDGETS
// =====================================================

const restoreBudgets = async (req, res) => {
  try {

    // Check authenticated user
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const { budgets } = req.body;

    // Check budget data
    if (
      !budgets ||
      typeof budgets !== "object" ||
      Array.isArray(budgets)
    ) {
      return res.status(400).json({
        message: "Invalid budgets data"
      });
    }

    // Convert backup object into array
    const budgetEntries = Object.entries(budgets);

    // Restore each budget
    for (const [month, amount] of budgetEntries) {

      const budgetAmount = Number(amount);

      if (
        !month ||
        Number.isNaN(budgetAmount) ||
        budgetAmount <= 0
      ) {
        continue;
      }

      // Check if budget already exists
      const existingBudget = await Budget.findOne({
        userId: req.userId,
        month
      });

      if (existingBudget) {

        // Update existing budget
        existingBudget.amount = budgetAmount;

        await existingBudget.save();

      } else {

        // Create new budget
        await Budget.create({
          userId: req.userId,
          month,
          amount: budgetAmount
        });

      }
    }

    // Get restored budgets
    const restoredBudgets = await Budget.find({
      userId: req.userId
    }).sort({
      month: -1
    });

    res.status(200).json({

      message: "Budgets restored successfully",

      budgets: restoredBudgets.map((budget) => ({
        id: budget._id,
        month: budget.month,
        amount: budget.amount
      }))

    });

  } catch (error) {

    console.error(
      "Restore Budgets Error:",
      error
    );

    res.status(500).json({
      message: error.message || "Server error"
    });

  }
};


// =====================================================
// EXPORT
// =====================================================
module.exports = {

  setBudget,

  getBudgets,

  updateBudget,

  deleteBudget,

  deleteAllBudgets,

  restoreBudgets

};