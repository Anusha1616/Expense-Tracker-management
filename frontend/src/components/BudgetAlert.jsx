function BudgetAlert({ expenses }) {

  // Get current month
  const currentMonth = new Date().toISOString().slice(0, 7);

  // Get all saved budgets
  const budgets = JSON.parse(
    localStorage.getItem("monthlyBudgets") || "{}"
  );

  // Current month's budget
  const budget = Number(
    budgets[currentMonth] || 0
  );

  // Calculate current month's expenses
  const monthlyExpense = expenses
    .filter((item) => {
      if (item.type !== "Expense") {
        return false;
      }

      const itemDate = new Date(item.date);

      if (isNaN(itemDate)) {
        return false;
      }

      const itemMonth =
        itemDate.toISOString().slice(0, 7);

      return itemMonth === currentMonth;
    })
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );

  // No budget set
  if (budget <= 0) {
    return (
      <div className="budget-alert info-alert">
        💰 No budget has been set for this month.
      </div>
    );
  }

  const percentage =
    (monthlyExpense / budget) * 100;

  // Budget exceeded
  if (monthlyExpense > budget) {

    const exceeded =
      monthlyExpense - budget;

    return (
      <div className="budget-alert danger-alert">

        🚨 <strong>Budget Exceeded!</strong>

        <p>
          You have exceeded your monthly budget
          by ₹{exceeded.toFixed(2)}.
        </p>

      </div>
    );
  }

  // 80% or more
  if (percentage >= 80) {

    const remaining =
      budget - monthlyExpense;

    return (
      <div className="budget-alert warning-alert">

        ⚠️ <strong>Budget Warning!</strong>

        <p>
          You have used {percentage.toFixed(0)}%
          of your monthly budget.
        </p>

        <p>
          Remaining: ₹{remaining.toFixed(2)}
        </p>

      </div>
    );
  }

  // Below 80%
  return (
    <div className="budget-alert success-alert">

      ✅ <strong>Budget Status</strong>

      <p>
        You have used {percentage.toFixed(0)}%
        of your monthly budget.
      </p>

      <p>
        Remaining: ₹
        {(budget - monthlyExpense).toFixed(2)}
      </p>

    </div>
  );
}

export default BudgetAlert;