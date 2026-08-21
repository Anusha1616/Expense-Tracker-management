import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function CategoryChart({ expenses }) {

  const expenseData = expenses.filter(
    (item) => item.type === "Expense"
  );

  const categoryTotals = {};

  expenseData.forEach((expense) => {

    const category = expense.category || "Other";

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += Number(expense.amount);

  });

  const categories = Object.keys(categoryTotals);

  const amounts = Object.values(categoryTotals);

  const data = {

    labels: categories,

    datasets: [
      {
        label: "Expenses",

        data: amounts,

        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffcd56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
          "#8bc34a",
          "#e91e63",
          "#00bcd4",
          "#795548"
        ],

        borderColor: "#ffffff",

        borderWidth: 2
      }
    ]

  };

  return (

    <div className="chart-container">

      <h2>🍕 Expense by Category</h2>

      {categories.length === 0 ? (

        <p>No expense data available.</p>

      ) : (

        <Pie data={data} />

      )}

    </div>

  );
}

export default CategoryChart;