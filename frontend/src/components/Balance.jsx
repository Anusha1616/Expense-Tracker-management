function Balance({ expenses }) {

  // =========================
  // TOTAL INCOME
  // =========================

  const totalIncome = expenses
    .filter((item) => item.type === "Income")
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );


  // =========================
  // TOTAL EXPENSE
  // =========================

  const totalExpense = expenses
    .filter((item) => item.type === "Expense")
    .reduce(
      (total, item) =>
        total + Number(item.amount),
      0
    );


  // =========================
  // TOTAL BALANCE
  // =========================

  const totalBalance =
    totalIncome - totalExpense;


  // =========================
  // TOTAL TRANSACTIONS
  // =========================

  const totalTransactions =
    expenses.length;


  return (

    <div className="balance-container">


      {/* =========================
          TOTAL BALANCE
      ========================= */}

      <div className="balance-card">

        <h3>
          💰 Total Balance
        </h3>

        <p>
          ₹{totalBalance}
        </p>

      </div>


      {/* =========================
          TOTAL INCOME
      ========================= */}

      <div className="income-card">

        <h3>
          💵 Total Income
        </h3>

        <p>
          ₹{totalIncome}
        </p>

      </div>


      {/* =========================
          TOTAL EXPENSE
      ========================= */}

      <div className="expense-card">

        <h3>
          💸 Total Expense
        </h3>

        <p>
          ₹{totalExpense}
        </p>

      </div>


      {/* =========================
          TOTAL TRANSACTIONS
      ========================= */}

      <div className="transaction-card">

        <h3>
          🧾 Transactions
        </h3>

        <p>
          {totalTransactions}
        </p>

      </div>


    </div>

  );
}

export default Balance;