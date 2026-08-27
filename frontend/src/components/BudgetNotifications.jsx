function BudgetNotifications({ expenses }) {

  // =========================
  // CURRENT MONTH
  // =========================

  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);


  // =========================
  // GET MONTHLY BUDGETS
  // =========================

  const savedBudgets =
    localStorage.getItem("monthlyBudgets");

  const budgets = savedBudgets
    ? JSON.parse(savedBudgets)
    : {};

  const budget =
    budgets[currentMonth] || 0;


  // =========================
  // CURRENT MONTH EXPENSES
  // =========================

  const monthlyExpenses = expenses.filter(
    (expense) =>
      expense.type === "Expense" &&
      expense.date &&
      expense.date.startsWith(currentMonth)
  );


  // =========================
  // TOTAL EXPENSE
  // =========================

  const totalExpense =
    monthlyExpenses.reduce(
      (total, expense) =>
        total + Number(expense.amount),
      0
    );


  // =========================
  // CALCULATIONS
  // =========================

  const remaining =
    budget - totalExpense;

  const percentage =
    budget > 0
      ? (totalExpense / budget) * 100
      : 0;


  // =========================
  // NO BUDGET
  // =========================

  if (budget === 0) {

    return (
      <div className="notification-card">

        <h3>🔔 Notifications</h3>

        <div className="notification-info">

          <span>💰</span>

          <div>
            <strong>No Budget Set</strong>

            <p>
              Set a monthly budget to
              receive spending alerts.
            </p>
          </div>

        </div>

      </div>
    );

  }


  // =========================
  // BUDGET EXCEEDED
  // =========================

  if (percentage > 100) {

    return (
      <div className="notification-card">

        <h3>🔔 Notifications</h3>

        <div className="notification-danger">

          <span>🚨</span>

          <div>

            <strong>
              Budget Exceeded
            </strong>

            <p>
              You exceeded your budget by ₹
              {Math.abs(remaining)}
            </p>

            <small>
              {percentage.toFixed(1)}% of
              your budget used
            </small>

          </div>

        </div>

      </div>
    );

  }


  // =========================
  // WARNING
  // =========================

  if (percentage >= 80) {

    return (
      <div className="notification-card">

        <h3>🔔 Notifications</h3>

        <div className="notification-warning">

          <span>⚠️</span>

          <div>

            <strong>
              Budget Warning
            </strong>

            <p>
              You have used{" "}
              {percentage.toFixed(1)}%
              of your monthly budget.
            </p>

            <small>
              Remaining: ₹{remaining}
            </small>

          </div>

        </div>

      </div>
    );

  }


  // =========================
  // SAFE
  // =========================

  return (
    <div className="notification-card">

      <h3>🔔 Notifications</h3>

      <div className="notification-success">

        <span>✅</span>

        <div>

          <strong>
            You're Within Budget
          </strong>

          <p>
            You have used{" "}
            {percentage.toFixed(1)}%
            of your monthly budget.
          </p>

          <small>
            Remaining: ₹{remaining}
          </small>

        </div>

      </div>

    </div>
  );
}

export default BudgetNotifications;