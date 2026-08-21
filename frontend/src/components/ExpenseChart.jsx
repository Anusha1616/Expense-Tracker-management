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

function ExpenseChart({ expenses }) {

  const totalIncome = expenses
    .filter((item) => item.type === "Income")
    .reduce(
      (total, item) => total + Number(item.amount),
      0
    );

  const totalExpense = expenses
    .filter((item) => item.type === "Expense")
    .reduce(
      (total, item) => total + Number(item.amount),
      0
    );

  const data = {

    labels: ["Income", "Expense"],

    datasets: [
      {
        label: "Amount (₹)",

        data: [
          totalIncome,
          totalExpense
        ],

        backgroundColor: [
          "#22c55e",
          "#ef4444"
        ],

        borderColor: [
          "#16a34a",
          "#dc2626"
        ],

        borderWidth: 2
      }
    ]

  };

  return (

    <div className="chart-container">

      <h2>💰 Income vs Expense</h2>

      <Bar data={data} />

    </div>

  );
}

export default ExpenseChart;