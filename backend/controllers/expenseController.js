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
      date
    } = req.body;

    // Check required fields
    if (!name || amount === undefined) {
      return res.status(400).json({
        message: "Name and amount are required"
      });
    }

    // Create transaction
    const expense = await Expense.create({
      userId: req.userId,
      name,
      amount,
      type: type || "Expense",
      category: category || "Other",
      date: date || new Date()
    });

    res.status(201).json({
      message: "Transaction added successfully",

      expense: {
        id: expense._id,
        name: expense.name,
        amount: expense.amount,
        type: expense.type,
        category: expense.category,
        date: expense.date
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
        date: expense.date
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
        date: expense.date
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

    const {
      name,
      amount,
      type,
      category,
      date
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

    // Update only fields that are provided

    if (name !== undefined) {
      expense.name = name;
    }

    if (amount !== undefined) {
      expense.amount = amount;
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

    await expense.save();

    res.status(200).json({

      message: "Transaction updated successfully",

      expense: {
        id: expense._id,
        name: expense.name,
        amount: expense.amount,
        type: expense.type,
        category: expense.category,
        date: expense.date
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
// EXPORT
// =====================================================

module.exports = {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense
};