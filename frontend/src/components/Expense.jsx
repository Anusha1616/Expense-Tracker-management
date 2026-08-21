function Expense({ expenses }) {

  const totalExpense = expenses
    .filter((expense) => expense.type === "Expense")
    .reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );

  return (
    <div className="card expense-card">
      <h3>Total Expense</h3>
      <h2>₹{totalExpense}</h2>
    </div>
  );
}

export default Expense;