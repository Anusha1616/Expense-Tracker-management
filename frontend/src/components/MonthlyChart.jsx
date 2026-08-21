import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function MonthlyChart({ expenses }) {

  const monthlyTotals = {};

  expenses
    .filter((item) => item.type === "Expense")
    .forEach((expense) => {

      if (!expense.date) return;

      const month = expense.date.slice(0, 7);

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }

      monthlyTotals[month] += Number(expense.amount);

    });

  const months = Object.keys(monthlyTotals);

  const amounts = Object.values(monthlyTotals);

  const data = {

    labels: months,

    datasets: [
      {
        label: "Monthly Spending (₹)",

        data: amounts,

        backgroundColor: [
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
          "#f59e0b",
          "#10b981",
          "#06b6d4",
          "#f43f5e",
          "#84cc16"
        ],

        borderColor: "#ffffff",

        borderWidth: 2
      }
    ]

  };

  return (

    <div className="chart-container">

      <h2>📅 Monthly Spending</h2>

      {months.length === 0 ? (

        <p>No monthly expense data available.</p>

      ) : (

        <Bar data={data} />

      )}

    </div>

  );
}

export default MonthlyChart;