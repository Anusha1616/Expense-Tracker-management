    function DashboardSummary({ expenses }) {

  const totalIncome = expenses
    .filter((item) => item.type === "Income")
    .reduce((total, item) => total + Number(item.amount), 0);

  const totalExpense = expenses
    .filter((item) => item.type === "Expense")
    .reduce((total, item) => total + Number(item.amount), 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="dashboard-summary">

      <div className="dashboard-summary-card income-card">
        <h3>💰 Total Income</h3>
        <p>₹{totalIncome}</p>
      </div>

      <div className="dashboard-summary-card expense-card">
        <h3>💸 Total Expense</h3>
        <p>₹{totalExpense}</p>
      </div>

      <div className="dashboard-summary-card balance-card">
        <h3>💵 Current Balance</h3>
        <p>₹{balance}</p>
      </div>

    </div>
  );
}

export default DashboardSummary;