const Expense = require("../models/Expense");


// =====================================================
// ADD EXPENSE / INCOME
// =====================================================

const addExpense = async (req, res) => {
  try {
    const {
      name,
      amount,
      type,
      category,
      date,
      paymentMethod
    } = req.body;

    // Check required fields
    if (!name || amount === undefined) {
      return res.status(400).json({
        message: "Name and amount are required"
      });
    }

    // Check authenticated user
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    // Create transaction
    const expense = await Expense.create({
      userId: req.userId,
      name,
      amount: Number(amount),
      type: type || "Expense",
      category: category || "Other",
      date: date || new Date(),
      paymentMethod: paymentMethod || "Cash"
    });

    res.status(201).json({
      message: "Transaction added successfully",

      expense: {
        id: expense._id,
        name: expense.name,
        amount: expense.amount,
        type: expense.type,
        category: expense.category,
        date: expense.date,
        paymentMethod: expense.paymentMethod
      }
    });

  } catch (error) {
    console.error("Add Expense Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// GET ALL USER EXPENSES
// =====================================================

const getExpenses = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const expenses = await Expense.find({
      userId: req.userId
    }).sort({
      date: -1
    });

    res.status(200).json({
      expenses: expenses.map((expense) => ({
        id: expense._id,
        name: expense.name,
        amount: expense.amount,
        type: expense.type,
        category: expense.category,
        date: expense.date,
        paymentMethod: expense.paymentMethod
      }))
    });

  } catch (error) {

    console.error("Get Expenses Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// GET SINGLE EXPENSE
// =====================================================

const getExpenseById = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    res.status(200).json({

      expense: {
        id: expense._id,
        name: expense.name,
        amount: expense.amount,
        type: expense.type,
        category: expense.category,
        date: expense.date,
        paymentMethod: expense.paymentMethod
      }

    });

  } catch (error) {

    console.error("Get Expense Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// UPDATE EXPENSE
// =====================================================

const updateExpense = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const {
      name,
      amount,
      type,
      category,
      date,
      paymentMethod
    } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    // Update only provided fields

    if (name !== undefined) {
      expense.name = name;
    }

    if (amount !== undefined) {
      expense.amount = Number(amount);
    }

    if (type !== undefined) {
      expense.type = type;
    }

    if (category !== undefined) {
      expense.category = category;
    }

    if (date !== undefined) {
      expense.date = date;
    }

    if (paymentMethod !== undefined) {
      expense.paymentMethod = paymentMethod;
    }

    await expense.save();

    res.status(200).json({

      message: "Transaction updated successfully",

      expense: {
        id: expense._id,
        name: expense.name,
        amount: expense.amount,
        type: expense.type,
        category: expense.category,
        date: expense.date,
        paymentMethod: expense.paymentMethod
      }

    });

  } catch (error) {

    console.error("Update Expense Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};


// =====================================================
// DELETE EXPENSE
// =====================================================

const deleteExpense = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!expense) {
      return res.status(404).json({
        message: "Transaction not found"
      });
    }

    await Expense.deleteOne({
      _id: req.params.id,
      userId: req.userId
    });

    res.status(200).json({
      message: "Transaction deleted successfully"
    });

  } catch (error) {

    console.error("Delete Expense Error:", error);

    res.status(500).json({
      message: "Server error"
    });
  }
};

// =====================================================
// DELETE ALL USER EXPENSES
// =====================================================

const deleteAllExpenses = async (req, res) => {
  try {

    // Check authenticated user
    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    // Delete ONLY this user's transactions
    const result = await Expense.deleteMany({
      userId: req.userId
    });

    res.status(200).json({
      message: "All transactions deleted successfully",
      deletedCount: result.deletedCount
    });

  } catch (error) {

    console.error(
      "Delete All Expenses Error:",
      error
    );

    res.status(500).json({
      message: "Server error"
    });
  }
};

// =====================================================
// RESTORE MULTIPLE TRANSACTIONS
// =====================================================

const restoreExpenses = async (req, res) => {
  try {

    if (!req.userId) {
      return res.status(401).json({
        message: "User not authenticated"
      });
    }

    const { expenses } = req.body;

    if (!Array.isArray(expenses)) {
      return res.status(400).json({
        message: "Invalid expenses data"
      });
    }

    // Prepare transactions for this logged-in user
    const transactions = expenses.map((expense) => ({
      userId: req.userId,
      name: expense.name,
      amount: Number(expense.amount),
      type: expense.type || "Expense",
      category: expense.category || "Other",
      date: expense.date || new Date(),
      paymentMethod: expense.paymentMethod || "Cash"
    }));

    // Insert all transactions into MongoDB
    const restoredExpenses =
      await Expense.insertMany(transactions);

    res.status(201).json({
      message: "Transactions restored successfully",

      expenses: restoredExpenses.map((expense) => ({
        id: expense._id,
        name: expense.name,
        amount: expense.amount,
        type: expense.type,
        category: expense.category,
        date: expense.date,
        paymentMethod: expense.paymentMethod
      }))
    });
  } catch (error) {

    console.error(
      "Restore Expenses Error:",
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
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  deleteAllExpenses,
  restoreExpenses
};
