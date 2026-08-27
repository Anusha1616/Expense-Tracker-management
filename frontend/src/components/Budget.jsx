import { useEffect, useMemo, useState } from "react";

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

  const [budgets, setBudgets] = useState(() => {

    try {

      const saved =
        localStorage.getItem("monthlyBudgets");

      return saved
        ? JSON.parse(saved)
        : {};

    } catch (error) {

      console.error(
        "Error loading budgets:",
        error
      );

      return {};

    }

  });


  // =========================================
  // BUDGET INPUT
  // =========================================

  const [budgetAmount, setBudgetAmount] =
    useState("");


  // =========================================
  // SAVE BUDGETS
  // =========================================

  useEffect(() => {

    localStorage.setItem(
      "monthlyBudgets",
      JSON.stringify(budgets)
    );

  }, [budgets]);


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
    Number(budgets[selectedMonth] || 0);


  // =========================================
  // REMAINING
  // =========================================

  const remaining =
    currentBudget - spent;


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

  const handleSetBudget = () => {

    const amount =
      Number(budgetAmount);

    if (
      !budgetAmount ||
      Number.isNaN(amount) ||
      amount <= 0
    ) {

      alert(
        "Please enter a valid budget amount."
      );

      return;

    }


    setBudgets((previous) => ({

      ...previous,

      [selectedMonth]: amount

    }));


    setBudgetAmount("");


    alert(
      `Budget set for ${formatMonth(
        selectedMonth
      )}`
    );

  };


  // =========================================
  // DELETE BUDGET
  // =========================================

  const deleteBudget = (month) => {

    const confirmDelete =
      window.confirm(
        `Delete budget for ${formatMonth(
          month
        )}?`
      );

    if (!confirmDelete) {
      return;
    }


    setBudgets((previous) => {

      const updated = {
        ...previous
      };

      delete updated[month];

      return updated;

    });

  };


  // =========================================
  // EDIT BUDGET
  // =========================================

  const editBudget = (month) => {

    const oldAmount =
      budgets[month];

    const newAmount =
      window.prompt(
        `Enter new budget for ${formatMonth(
          month
        )}:`,
        oldAmount
      );


    if (
      newAmount === null ||
      newAmount.trim() === ""
    ) {

      return;

    }


    const amount =
      Number(newAmount);


    if (
      Number.isNaN(amount) ||
      amount <= 0
    ) {

      alert(
        "Please enter a valid amount."
      );

      return;

    }


    setBudgets((previous) => ({

      ...previous,

      [month]: amount

    }));

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

            ⚠️ Please set a budget for{" "}
            {formatMonth(selectedMonth)}.

          </div>

        ) : remaining < 0 ? (

          <div className="budget-message danger-message">


             100%
            🚨 You exceeded your budget by ₹
            {Math.abs(
              remaining
            ).toLocaleString("en-IN")}.

          </div>

        ) : percentage >= 80 ? (

          <div className="budget-message warning-message">

            80%

            ⚠️ You have used more than 80%
            of your budget.

          </div>

        ) : (

          <div className="budget-message success-message">

            60%

            ✅ Good Job! You are within
            your budget.

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
                ([month, amount]) => (

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
                        amount
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </strong>


                    <div className="history-actions">

                      <button
                        className="edit-budget-btn"
                        onClick={() =>
                          editBudget(month)
                        }
                      >
                        ✏️ Edit
                      </button>


                      <button
                        className="delete-budget-btn"
                        onClick={() =>
                          deleteBudget(month)
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