import { useState, useEffect } from "react";
import "./App.css";
import API from "./api/api";


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
import DashboardSummary from "./components/DashboardSummary";
import Login from "./components/Login";
import PaymentMethodChart from "./components/PaymentMethodChart";
import Profile from "./components/Profile";
import Security from "./components/Security";
import ExportPDF from "./components/ExportPDF";
import BudgetAlert from "./components/BudgetAlert";



function App() {

  // =========================
  // PAGE
  // =========================

  const [page, setPage] = useState("dashboard");


  // =========================
  // LOGIN
  // =========================

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return !!localStorage.getItem("token");
});

  const handleLogin = () => {

    setIsLoggedIn(true);

    setPage("dashboard");

  };

const handleLogout = () => {

  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (!confirmLogout) {
    return;
  }

  // Remove login information
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("loggedIn");

  // Clear transactions from React state
  setExpenses([]);

  // Show login page
  setIsLoggedIn(false);
};



  // =========================
  // THEME
  // =========================

  const [theme, setTheme] = useState(() => {

    const savedTheme =
      localStorage.getItem("theme");

    return savedTheme || "light";

  });


  useEffect(() => {

    localStorage.setItem(
      "theme",
      theme
    );

  }, [theme]);



  // =========================
  // EXPENSES
  // =========================
const [expenses, setExpenses] = useState([]); 

useEffect(() => {
  if (!isLoggedIn) return;

  const fetchExpenses = async () => {
    try {
      const response = await API.get("/expenses");

      setExpenses(response.data.expenses);

    } catch (error) {
      console.error("Failed to fetch expenses:", error);

      if (error.response) {
        console.error("Backend error:", error.response.data);
      }
    }
  };

  fetchExpenses();
}, [isLoggedIn]);



  // =========================
  // TRANSACTION MONTH
  // =========================

  const [selectedMonth, setSelectedMonth] =
    useState("All");



  // =========================
  // SAVE EXPENSES
  // =========================




  // =========================
  // DELETE ONE TRANSACTION
  // =========================
const deleteExpense = async (index) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this transaction?"
  );

  if (!confirmDelete) {
    return;
  }

  try {

    const expense = expenses[index];

    // Delete from MongoDB
    await API.delete(`/expenses/${expense.id}`);

    // Remove from frontend
    const updatedExpenses = expenses.filter(
      (_, i) => i !== index
    );

    setExpenses(updatedExpenses);

    alert("Transaction deleted successfully!");

  } catch (error) {

    console.error("Delete transaction error:", error);

    alert(
      error.response?.data?.message ||
      "Failed to delete transaction"
    );
  }
};


  // =========================
  // DELETE ALL TRANSACTIONS
  // =========================

  const clearAllExpenses = () => {

    const confirmClear =
      window.confirm(
        "Are you sure you want to delete ALL transactions?"
      );

    if (!confirmClear) {
      return;
    }


    setExpenses([]);

  };



  // =========================
  // EXPORT CSV
  // =========================

  const exportExpenses = () => {

    if (expenses.length === 0) {

      alert(
        "No transactions to export."
      );

      return;

    }


    const headers = [

      "Name",

      "Amount",

      "Type",

      "Category",

      "Payment Method",

      "Date"

    ];


    const rows =
      expenses.map(
        (expense) => [

          expense.name,

          expense.amount,

          expense.type,

          expense.category || "",

          expense.paymentMethod || "Cash",

          expense.date

        ]
      );


    const csvContent = [

      headers.join(","),

      ...rows.map(
        (row) =>
          row
            .map(
              (value) =>
                `"${value}"`
            )
            .join(",")
      )

    ].join("\n");


    const blob = new Blob(

      [csvContent],

      {
        type:
          "text/csv;charset=utf-8;"
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

    const current =
      expenses[index];


    // NAME

    const name =
      prompt(
        "Enter transaction name",
        current.name
      );


    if (!name) {
      return;
    }



    // AMOUNT

    const amount =
      prompt(
        "Enter amount",
        current.amount
      );


    if (!amount) {
      return;
    }



    // TYPE

    const type =
      prompt(
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

    let category =
      current.category;


    if (type === "Expense") {

      category =
        prompt(
          "Enter category",
          current.category ||
          "Food"
        );


      if (!category) {
        return;
      }

    }
    else {

      category = "";

    }



    // DATE

    const date =
      prompt(
        "Enter date (YYYY-MM-DD)",
        current.date
      );


    if (!date) {
      return;
    }



    // PAYMENT METHOD

    const paymentMethod =
      prompt(

        "Enter payment method: Cash, UPI, Debit Card, Credit Card or Bank Transfer",

        current.paymentMethod ||
        "Cash"

      );


    if (!paymentMethod) {
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

      date: date,

      paymentMethod:
        paymentMethod

    };


    setExpenses(
      updatedExpenses
    );

  };



  // =========================
  // REPORT FILTER
  // =========================

  const reportExpenses =
    selectedMonth === "All"

      ? expenses

      : expenses.filter(
          (expense) =>
            expense.date?.startsWith(
              selectedMonth
            )
        );



  // =========================
  // LOGIN PAGE
  // =========================

  if (!isLoggedIn) {

    return (
      <Login
        onLogin={handleLogin}
      />
    );

  }



  // =========================
  // MAIN RETURN
  // =========================

  return (

    <div
      className={`app ${theme}`}
    >


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

            <DashboardSummary
              expenses={expenses}
            />

             <BudgetAlert
      expenses={expenses}
    />


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

              setExpenses={
                setExpenses
              }

            />



            {/* TRANSACTION LIST */}

            <ExpenseList

              expenses={expenses}

              deleteExpense={
                deleteExpense
              }

              editExpense={
                editExpense
              }

              selectedMonth={
                selectedMonth
              }

              setSelectedMonth={
                setSelectedMonth
              }

            />



            {/* DELETE ALL */}

            <button

              className="clear-all-btn"

              onClick={
                clearAllExpenses
              }

            >

              🗑️ Delete All Transactions

            </button>



            {/* EXPORT CSV */}

            <button

              className="export-btn"

              onClick={
                exportExpenses
              }

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

    {/* TITLE */}

    <h2>
      📊 Reports & Charts
    </h2>


    {/* =========================
        REPORT MONTH FILTER
    ========================= */}

    <div className="report-month-filter">

      <label>
        📅 Select Month:
      </label>

      <select
        value={selectedMonth}
        onChange={(e) =>
          setSelectedMonth(e.target.value)
        }
      >

        <option value="All">
          All Months
        </option>

        <option value="2026-01">
          January 2026
        </option>

        <option value="2026-02">
          February 2026
        </option>

        <option value="2026-03">
          March 2026
        </option>

        <option value="2026-04">
          April 2026
        </option>

        <option value="2026-05">
          May 2026
        </option>

        <option value="2026-06">
          June 2026
        </option>

        <option value="2026-07">
          July 2026
        </option>

        <option value="2026-08">
          August 2026
        </option>

        <option value="2026-09">
          September 2026
        </option>

        <option value="2026-10">
          October 2026
        </option>

        <option value="2026-11">
          November 2026
        </option>

        <option value="2026-12">
          December 2026
        </option>

      </select>

    </div>


    {/* =========================
        REPORT SUMMARY
    ========================= */}

    <ReportSummary
      expenses={reportExpenses}
    />


    {/* =========================
        EXPORT PDF
    ========================= */}

    <ExportPDF
      expenses={reportExpenses}
    />


    {/* =========================
        TOP CATEGORIES
    ========================= */}

    <TopCategories
      expenses={reportExpenses}
    />


    {/* =========================
        PAYMENT METHODS
    ========================= */}

    <PaymentMethodChart
      expenses={reportExpenses}
    />


    {/* =========================
        INCOME VS EXPENSE
    ========================= */}

    <ExpenseChart
      expenses={reportExpenses}
    />


    {/* =========================
        CATEGORY CHART
    ========================= */}

    <CategoryChart
      expenses={reportExpenses}
    />


    {/* =========================
        MONTHLY CHART
    ========================= */}

    <MonthlyChart
      expenses={reportExpenses}
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
    PROFILE
========================= */}

{page === "profile" && (

  <Profile
    setPage={setPage}
  />

)}


{/* =========================
    SECURITY
========================= */}

{page === "security" && (

  <Security
    setPage={setPage}
    onLogout={handleLogout}
  />

)}



        {/* =========================
            SETTINGS
        ========================= */}

       {page === "settings" && (
  <Settings
    setTheme={setTheme}
    setExpenses={setExpenses}
    setPage={setPage}
    onLogout={handleLogout}
    expenses={expenses}
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