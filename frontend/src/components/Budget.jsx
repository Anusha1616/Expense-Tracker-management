import { useState, useEffect } from "react";

function Budget({ expenses }) {

  // Current month
  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);

  const [selectedMonth, setSelectedMonth] =
    useState(currentMonth);

  // Budget amount
  const [budget, setBudget] = useState(() => {
    const savedBudget =
      localStorage.getItem("monthlyBudget");

    return savedBudget
      ? Number(savedBudget)
      : 0;
  });

  const [inputBudget, setInputBudget] = useState("");

  // Save budget
  useEffect(() => {
    localStorage.setItem(
      "monthlyBudget",
      budget
    );
  }, [budget]);

  // Only expenses from selected month
  const monthlyExpenses = expenses.filter(
    (item) =>
      item.type === "Expense" &&
      item.date &&
      item.date.startsWith(selectedMonth)
  );

  // Calculate monthly expense
  const totalExpense = monthlyExpenses.reduce(
    (total, item) =>
      total + Number(item.amount),
    0
  );

  // Remaining budget
  const remaining = budget - totalExpense;

  // Percentage used
  const percentage =
    budget > 0
      ? (totalExpense / budget) * 100
      : 0;

  const progress = Math.min(percentage, 100);

  // Set budget
  const handleBudget = () => {

    if (
      inputBudget === "" ||
      Number(inputBudget) <= 0
    ) {
      alert("Please enter a valid budget");
      return;
    }

    setBudget(Number(inputBudget));
    setInputBudget("");
  };

  return (
    <div className="budget-page">

      <h2>💰 Monthly Budget</h2>

      {/* MONTH */}

      <div className="budget-input-card">

        <h3>📅 Select Month</h3>

        <input
          type="month"
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(e.target.value)
          }
        />

      </div>


      {/* BUDGET INPUT */}

      <div className="budget-input-card">

        <h3>
          💰 Set Budget for {selectedMonth}
        </h3>

        <input
          type="number"
          placeholder="Enter budget amount"
          value={inputBudget}
          onChange={(e) =>
            setInputBudget(e.target.value)
          }
        />

        <button onClick={handleBudget}>
          Set Budget
        </button>

      </div>


      {/* SUMMARY */}

      <div className="budget-summary">

        <div className="budget-card budget-total">

          <h3>Monthly Budget</h3>

          <p>₹{budget}</p>

        </div>


        <div className="budget-card budget-spent">

          <h3>Spent This Month</h3>

          <p>₹{totalExpense}</p>

        </div>


        <div
          className={`budget-card ${
            remaining >= 0
              ? "budget-remaining"
              : "budget-over"
          }`}
        >

          <h3>
            {remaining >= 0
              ? "Remaining"
              : "Exceeded By"}
          </h3>

          <p>
            ₹{Math.abs(remaining)}
          </p>

        </div>

      </div>


      {/* PROGRESS */}

      <div className="budget-progress-card">

        <div className="progress-header">

          <span>
            Budget Used
          </span>

          <strong>
            {percentage.toFixed(1)}%
          </strong>

        </div>


        <div className="progress-bar">

          <div
  className={`progress-fill ${
    percentage > 100
      ? "progress-danger"
      : percentage >= 80
      ? "progress-warning"
      : "progress-safe"
  }`}
  style={{
    width: `${progress}%`
  }}
></div>
        </div>


        {/* STATUS */}

        {budget === 0 ? (

          <p>
            💰 Enter your budget above.
          </p>

        ) : percentage > 100 ? (

          <div className="budget-exceeded">

            <span className="warning-icon">
              ⚠️
            </span>

            <div>

              <strong>
                Budget Limit Exceeded!
              </strong>

              <p>
                You have exceeded your budget by ₹
                {Math.abs(remaining)}
              </p>

            </div>

          </div>

        ) : percentage >= 80 ? (

          <div className="budget-warning">

            <span className="warning-icon">
              ⚠️
            </span>

            <div>

              <strong>
                Warning!
              </strong>

              <p>
                You are close to your budget limit.
              </p>

            </div>

          </div>

        ) : (

          <div className="budget-success">

            <span>
              ✅
            </span>

            <div>

              <strong>
                Good Job!
              </strong>

              <p>
                You are within your budget.
              </p>

            </div>

          </div>

        )}

      </div>


      {/* MONTHLY EXPENSES */}

      <div className="budget-progress-card">

        <h3>
          📋 Expenses in {selectedMonth}
        </h3>

        {monthlyExpenses.length === 0 ? (

          <p>
            No expenses for this month.
          </p>

        ) : (

          monthlyExpenses.map((expense) => (

            <div
              className="recent-item"
              key={expense.id}
            >

              <div className="recent-icon expense-icon">
                💸
              </div>

              <div className="recent-details">

                <h4>
                  {expense.name}
                </h4>

                <p>
                  📂 {expense.category}
                  {" • "}
                  📅 {expense.date}
                </p>

              </div>

              <div className="recent-amount recent-expense">

                -₹{expense.amount}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}

export default Budget;