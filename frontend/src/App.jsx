import { useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import Balance from "./components/Balance";
import AddExpenseForm from "./components/AddExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";
import ExpenseChart from "./components/ExpenseChart";
import CategoryChart from "./components/CategoryChart";
import MonthlyChart from "./components/MonthlyChart";
import Budget from "./components/Budget";
import Settings from "./components/Settings";
import RecentTransactions from "./components/RecentTransactions";
import TopCategories from "./components/TopCategories";
import ReportSummary from "./components/ReportSummary";


function App() {

  // =========================
  // PAGE
  // =========================

  const [page, setPage] = useState("dashboard");


  // =========================
  // THEME
  // =========================

  const [theme, setTheme] = useState(() => {

    const savedTheme = localStorage.getItem("theme");

    return savedTheme || "light";

  });


  useEffect(() => {

    localStorage.setItem("theme", theme);

  }, [theme]);


  // =========================
  // EXPENSES
  // =========================

  const [expenses, setExpenses] = useState(() => {

    const savedExpenses =
      localStorage.getItem("expenses");

    return savedExpenses
      ? JSON.parse(savedExpenses)
      : [];

  }); 

  const [selectedMonth, setSelectedMonth] = useState("All");

  // Save expenses to localStorage

  useEffect(() => {

    localStorage.setItem(
      "expenses",
      JSON.stringify(expenses)
    );

  }, [expenses]);


  // =========================
  // DELETE ONE TRANSACTION
  // =========================

  const deleteExpense = (index) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) {
      return;
    }

    const updatedExpenses =
      expenses.filter((_, i) => i !== index);

    setExpenses(updatedExpenses);

  };


  // =========================
  // DELETE ALL TRANSACTIONS
  // =========================

  const clearAllExpenses = () => {

    const confirmClear = window.confirm(
      "Are you sure you want to delete ALL transactions?"
    );

    if (!confirmClear) {
      return;
    }

    setExpenses([]);

  };


  // =========================
  // EXPORT TRANSACTIONS
  // =========================

  const exportExpenses = () => {

    if (expenses.length === 0) {

      alert("No transactions to export.");

      return;

    }


    const headers = [
      "Name",
      "Amount",
      "Type",
      "Category",
      "Date"
    ];


    const rows = expenses.map((expense) => [

      expense.name,
      expense.amount,
      expense.type,
      expense.category || "",
      expense.date

    ]);


    const csvContent = [

      headers.join(","),

      ...rows.map((row) =>
        row
          .map((value) => `"${value}"`)
          .join(",")
      )

    ].join("\n");


    const blob = new Blob(

      [csvContent],

      {
        type: "text/csv;charset=utf-8;"
      }

    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "expense-transactions.csv";


    link.click();


    URL.revokeObjectURL(url);

  };


  // =========================
  // EDIT TRANSACTION
  // =========================

  const editExpense = (index) => {

    const current = expenses[index];


    // NAME

    const name = prompt(
      "Enter transaction name",
      current.name
    );

    if (!name) {
      return;
    }


    // AMOUNT

    const amount = prompt(
      "Enter amount",
      current.amount
    );

    if (!amount) {
      return;
    }


    // TYPE

    const type = prompt(
      "Enter type: Income or Expense",
      current.type
    );


    if (
      type !== "Income" &&
      type !== "Expense"
    ) {

      alert(
        "Type must be Income or Expense"
      );

      return;

    }


    // CATEGORY

    let category = current.category;


    if (type === "Expense") {

      category = prompt(
        "Enter category",
        current.category || "Food"
      );


      if (!category) {
        return;
      }

    } else {

      category = "";

    }


    // DATE

    const date = prompt(
      "Enter date (YYYY-MM-DD)",
      current.date
    );


    if (!date) {
      return;
    }


    // UPDATE

    const updatedExpenses =
      [...expenses];


    updatedExpenses[index] = {

      ...current,

      name: name,

      amount: Number(amount),

      type: type,

      category: category,

      date: date

    };


    setExpenses(updatedExpenses);

  };


  // =========================
  // RETURN
  // =========================

  return (

    <div className={`app ${theme}`}>


      {/* =========================
          SIDEBAR
      ========================= */}

      <Sidebar
        setPage={setPage}
      />


      <div className="container">


        {/* =========================
            HEADER
        ========================= */}

        <Header />


        {/* =========================
            DASHBOARD
        ========================= */}

        {page === "dashboard" && (

          <>

            <Balance
              expenses={expenses}
            />


            <RecentTransactions

              expenses={expenses}

              setPage={setPage}

            />

          </>

        )}


        {/* =========================
            TRANSACTIONS
        ========================= */}

        {page === "transactions" && (

          <div className="transactions-page">


            <h2>
              💳 Transactions
            </h2>


            {/* ADD EXPENSE / INCOME */}

            <AddExpenseForm

              expenses={expenses}

              setExpenses={setExpenses}

            />


            {/* TRANSACTION LIST */}

            <ExpenseList

              expenses={expenses}

              deleteExpense={deleteExpense}

              editExpense={editExpense}

              selectedMonth={selectedMonth}

              setSelectedMonth={setSelectedMonth}


            />        


            {/* DELETE ALL */}

            <button

              className="clear-all-btn"

              onClick={clearAllExpenses}

            >

              🗑️ Delete All Transactions

            </button>


            {/* EXPORT */}

            <button

              className="export-btn"

              onClick={exportExpenses}

            >

              📥 Export CSV

            </button>


          </div>

        )}


        {/* =========================
            REPORTS
        ========================= */}

        {page === "reports" && (

          <div className="reports-page">


            <h2>
              📊 Reports & Charts
            </h2>


            <ReportSummary
              expenses={expenses}
            />


            <TopCategories
              expenses={expenses}
            />


            <ExpenseChart
              expenses={expenses}
            />


            <CategoryChart
              expenses={expenses}
            />


            <MonthlyChart
              expenses={expenses}
            />


          </div>

        )}


        {/* =========================
            BUDGET
        ========================= */}

        {page === "budget" && (

          <Budget
            expenses={expenses}
          />

        )}


        {/* =========================
            SETTINGS
        ========================= */}

        {page === "settings" && (

          <Settings

            setTheme={setTheme}

            setExpenses={setExpenses}

          />

        )}


        {/* =========================
            FOOTER
        ========================= */}

        <Footer />


      </div>

    </div>

  );

}


export default App;