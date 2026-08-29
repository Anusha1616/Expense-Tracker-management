import { useEffect, useState } from "react";
import API from "../api/api";

function BudgetAlert({ expenses }) {

  // Get current month
  const currentMonth = new Date()
    .toISOString()
    .slice(0, 7);

  const [budget, setBudget] = useState(0);

  // Get current month's budget from backend
  useEffect(() => {

    const fetchBudget = async () => {

      try {

        const response = await API.get("/budgets");

        const currentBudget =
          response.data.budgets.find(
            (item) =>
              item.month === currentMonth
          );

        setBudget(
          Number(currentBudget?.amount || 0)
        );

      } catch (error) {

        console.error(
          "Failed to fetch budget:",
          error
        );

        setBudget(0);
      }

    };

    fetchBudget();

  }, [currentMonth]);

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