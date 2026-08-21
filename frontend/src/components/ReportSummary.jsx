function ReportSummary({ expenses }) {

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

  const balance = totalIncome - totalExpense;

  const savingsPercentage =
    totalIncome > 0
      ? ((balance / totalIncome) * 100).toFixed(1)
      : 0;

  return (
    <div className="report-summary">

      <div className="report-card income-report">

        <h3>💰 Total Income</h3>

        <p>₹{totalIncome}</p>

      </div>


      <div className="report-card expense-report">

        <h3>💸 Total Expense</h3>

        <p>₹{totalExpense}</p>

      </div>


      <div className="report-card balance-report">

        <h3>💵 Balance</h3>

        <p>₹{balance}</p>

      </div>


      <div className="report-card saving-report">

        <h3>📈 Savings</h3>

        <p>{savingsPercentage}%</p>

      </div>

    </div>
  );
}

export default ReportSummary;