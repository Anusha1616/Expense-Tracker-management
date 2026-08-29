
import { useEffect, useMemo, useState } from "react";
import API from "../api/api";

function Budget({ expenses = [] }) {

  // =========================================
  // SELECTED MONTH
  // =========================================

  const getCurrentMonth = () => {
    const now = new Date();

    return `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
  };

  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth());


  // =========================================
  // BUDGETS
  // =========================================


  // =========================================
  // BUDGET INPUT
  // =========================================

  const [budgetAmount, setBudgetAmount] =
    useState("");

 const [budgets, setBudgets] = useState({});

  // =========================================
  // SAVE BUDGETS
  // =========================================
useEffect(() => {

  const fetchBudgets = async () => {

    try {

      const response = await API.get("/budgets");

      const budgetData = {};

      response.data.budgets.forEach((budget) => {

        budgetData[budget.month] = {
          id: budget.id,
          amount: budget.amount
        };

      });

      setBudgets(budgetData);

    } catch (error) {

      console.error("Failed to fetch budgets:", error);

    }

  };

  fetchBudgets();

}, []);
  // =========================================
  // MONTH NAME
  // =========================================

  const formatMonth = (month) => {

    const [year, monthNumber] =
      month.split("-");

    const date = new Date(
      Number(year),
      Number(monthNumber) - 1,
      1
    );

    return date.toLocaleString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );

  };


  // =========================================
  // SELECTED MONTH EXPENSES
  // =========================================

  const monthExpenses = useMemo(() => {

    return expenses.filter((expense) => {

      if (!expense.date) {
        return false;
      }

      return expense.date.startsWith(
        selectedMonth
      );

    });

  }, [expenses, selectedMonth]);


  // =========================================
  // TOTAL EXPENSE
  // =========================================

  const spent = useMemo(() => {

    return monthExpenses
      .filter(
        (expense) =>
          expense.type === "Expense"
      )
      .reduce(
        (total, expense) =>
          total +
          Number(expense.amount || 0),
        0
      );

  }, [monthExpenses]);


  // =========================================
  // CURRENT BUDGET
  // =========================================
const currentBudget =
  Number(budgets[selectedMonth]?.amount) || 0;

  // =========================================
  // REMAINING
  // =========================================

  // const remaining =
  //   currentBudget - spent;

 const remaining = Math.max(
  0,
  currentBudget - spent
);

  // =========================================
  // BUDGET USED %
  // =========================================

  const percentage =
    currentBudget > 0
      ? Math.min(
          (spent / currentBudget) * 100,
          100
        )
      : 0;


  // =========================================
  // SET / UPDATE BUDGET
  // =========================================

 const handleSetBudget = async () => {

  if (!budgetAmount || Number(budgetAmount) <= 0) {
    alert("Please enter a valid budget amount");
    return;
  }

  try {

    const response = await API.post(
      "/budgets",
      {
        month: selectedMonth,
        amount: Number(budgetAmount)
      }
    );

    console.log(
      "Budget saved:",
      response.data
    );

    const savedBudget =
      response.data.budget;

setBudgets((prev) => ({
  ...prev,
  [savedBudget.month]: {
    id: savedBudget.id,
    amount: savedBudget.amount
  }
}));

    alert("Budget saved successfully!");

  } catch (error) {

    console.error(
      "Save budget error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to save budget"
    );
  }
};

  // =========================================
  // DELETE BUDGET
  // =========================================

const deleteBudget = async (id, month) => {

  const confirmDelete = window.confirm(
    `Delete budget for ${formatMonth(month)}?`
  );

  if (!confirmDelete) {
    return;
  }

  try {

    await API.delete(`/budgets/${id}`);

    setBudgets((previous) => {

      const updated = { ...previous };

      delete updated[month];

      return updated;
    });

    alert("Budget deleted successfully!");

  } catch (error) {

    console.error(
      "Delete budget error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to delete budget"
    );
  }
};

// =========================================
// EDIT BUDGET
// =========================================
// =========================================
// EDIT BUDGET
// =========================================
const editBudget = async (id, month) => {

  console.log("EDIT ID:", id);
  console.log("EDIT MONTH:", month);

  const oldAmount = budgets[month]?.amount;

  const newAmount = window.prompt(
    `Enter new budget for ${formatMonth(month)}:`,
    oldAmount
  );

  if (
    newAmount === null ||
    newAmount.trim() === ""
  ) {
    return;
  }

  const amount = Number(newAmount);

  if (
    Number.isNaN(amount) ||
    amount <= 0
  ) {
    alert("Please enter a valid amount.");
    return;
  }

  try {

    const response = await API.put(
      `/budgets/${id}`,
      {
        amount
      }
    );

    console.log("UPDATE RESPONSE:", response.data);

    const updatedBudget = response.data.budget;

    setBudgets((previous) => ({
      ...previous,
      [updatedBudget.month]: updatedBudget
    }));

    alert("Budget updated successfully!");

  } catch (error) {

    console.error(
      "Update budget error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to update budget"
    );
  }
};
  // =========================================
  // MONTH OPTIONS
  // =========================================

  const months = [

    ["2026-01", "January 2026"],
    ["2026-02", "February 2026"],
    ["2026-03", "March 2026"],
    ["2026-04", "April 2026"],
    ["2026-05", "May 2026"],
    ["2026-06", "June 2026"],
    ["2026-07", "July 2026"],
    ["2026-08", "August 2026"],
    ["2026-09", "September 2026"],
    ["2026-10", "October 2026"],
    ["2026-11", "November 2026"],
    ["2026-12", "December 2026"]

  ];


  // =========================================
  // RENDER
  // =========================================

  return (

    <div className="budget-page">

      {/* =====================================
          TITLE
      ===================================== */}

      <div className="budget-header">

        <h1>
          💰 Monthly Budget
        </h1>

        <p>
          Plan and control your monthly
          spending.
        </p>

      </div>


      {/* =====================================
          SELECT MONTH
      ===================================== */}

      <div className="budget-card">

        <h2>
          📅 Select Month
        </h2>

        <select
          className="budget-month-select"
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(
              e.target.value
            )
          }
        >

          {months.map(
            ([value, label]) => (

              <option
                key={value}
                value={value}
              >
                {label}
              </option>

            )
          )}

        </select>

      </div>


      {/* =====================================
          SET BUDGET
      ===================================== */}

      <div className="budget-card">

        <h2>
          💰 Set Budget for{" "}
          {formatMonth(selectedMonth)}
        </h2>

        <input
          className="budget-input"
          type="number"
          min="0"
          placeholder="Enter budget amount"
          value={budgetAmount}
          onChange={(e) =>
            setBudgetAmount(
              e.target.value
            )
          }
        />

        <button
          className="set-budget-btn"
          onClick={handleSetBudget}
        >
          💾 Set Budget
        </button>

      </div>


      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="budget-summary">

        {/* BUDGET */}

        <div className="budget-summary-card budget-blue">

          <h3>
            💰 Monthly Budget
          </h3>

          <strong>
            ₹{currentBudget.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>


        {/* SPENT */}

        <div className="budget-summary-card budget-red">

          <h3>
            💸 Spent This Month
          </h3>

          <strong>
            ₹{spent.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>


        {/* REMAINING */}

        <div
          className={`budget-summary-card ${
            remaining >= 0
              ? "budget-green"
              : "budget-danger"
          }`}
        >

          <h3>
            💵 Remaining
          </h3>

          <strong>
            ₹{remaining.toLocaleString(
              "en-IN"
            )}
          </strong>

        </div>

      </div>


      {/* =====================================
          PROGRESS
      ===================================== */}

      <div className="budget-card">

        <div className="budget-progress-header">

          <strong>
            Budget Used
          </strong>

          <strong>
            {percentage.toFixed(1)}%
          </strong>

        </div>


        <div className="budget-progress">

          <div
            className={`budget-progress-bar ${
              percentage >= 100
                ? "danger"
                : percentage >= 80
                ? "warning"
                : "safe"
            }`}
            style={{
              width: `${percentage}%`
            }}
          />

        </div>


        {/* MESSAGE */}
{currentBudget === 0 ? (

  <div className="budget-message warning-message">
    ⚠️ Please set a budget for {formatMonth(selectedMonth)}.
  </div>

)  : spent > currentBudget ? (

  <div className="budget-message danger-message">
    🚨 <strong>Budget Exceeded!</strong>

    <p>
      You have exceeded your budget by ₹
      {Math.abs(remaining).toLocaleString("en-IN")}.
    </p>
  </div>

) : percentage >= 80 ? (

  <div className="budget-message warning-message">
    ⚠️ You have used more than 80% of your budget.
  </div>

) : (

  <div className="budget-message success-message">
    ✅ <strong>Budget Status</strong>

    <p>
      You have used {percentage.toFixed(0)}%
      of your monthly budget.
    </p>
{/* 
    <p>
      Remaining: ₹
      {remaining.toLocaleString("en-IN")}
    </p> */}
  </div>

)}

      </div>


      {/* =====================================
          MONTH EXPENSES
      ===================================== */}

      <div className="budget-card">

        <h2>
          📋 Expenses in{" "}
          {formatMonth(selectedMonth)}
        </h2>


        {monthExpenses.length === 0 ? (

          <div className="no-budget-expenses">

            <p>
              No expenses for this month.
            </p>

          </div>

        ) : (

          <div className="budget-expense-list">

            {monthExpenses
              .filter(
                (expense) =>
                  expense.type ===
                  "Expense"
              )
              .map((expense) => (

                <div
                  className="budget-expense-row"
                  key={
                    expense.id ||
                    `${expense.name}-${expense.date}-${expense.amount}`
                  }
                >

                  <div>

                    <strong>
                      {expense.name}
                    </strong>

                    <small>
                      {expense.category ||
                        "Other"}{" "}
                      •{" "}
                      {expense.date}
                    </small>

                  </div>

                  <strong>
                    -₹
                    {Number(
                      expense.amount || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

              ))}

          </div>

        )}

      </div>


      {/* =====================================
          BUDGET HISTORY
      ===================================== */}

      <div className="budget-card">

        <h2>
          📜 Budget History
        </h2>


        {Object.keys(budgets).length === 0 ? (

          <p className="empty-history">
            No saved budgets yet.
          </p>

        ) : (

          <div className="budget-history">

            {Object.entries(budgets)
              .sort()
              .reverse()
              .map(
                ([month, budget]) => (

                  <div
                    className="budget-history-row"
                    key={month}
                  >

                    <div className="history-month">

                      <span>
                        💰
                      </span>

                      <div>

                        <strong>
                          {formatMonth(
                            month
                          )}
                        </strong>

                        <small>
                          Monthly Budget
                        </small>

                      </div>

                    </div>


                    <strong className="history-amount">

                      ₹
                      {Number(
                        budget.amount
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>


                    <div className="history-actions">

                      <button
  className="edit-budget-btn"
  onClick={() =>
    editBudget(
      budgets[month].id,
      month
    )
  }
>
  ✏️ Edit
</button>


                    <button
  className="delete-budget-btn"
  onClick={() =>
    deleteBudget(
      budgets[month].id,
      month
    )
  }
>
  🗑️ Delete
</button>
                    </div>

                  </div>

                )
              )}

          </div>

        )}

      </div>


      {/* =====================================
          FOOTER NOTE
      ===================================== */}

      <div className="budget-note">

        💡 Tip: Set a realistic monthly
        budget and monitor your spending
        regularly.

      </div>

    </div>

  );

}

export default Budget;