function RecentTransactions({ expenses, setPage }) {

  // Show latest 5 transactions
  const recentExpenses = [...expenses]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);


  return (
    <div className="recent-transactions">

      <div className="recent-header">

        <h2>🕒 Recent Transactions</h2>

        <button
          onClick={() => setPage("transactions")}
        >
          View All
        </button>

      </div>


      {recentExpenses.length === 0 ? (

        <div className="no-recent">
          <p>📭 No transactions yet.</p>

          <button
            onClick={() => setPage("transactions")}
          >
            Add Transaction
          </button>
        </div>

      ) : (

        <div className="recent-list">

          {recentExpenses.map((expense) => (

            <div
              className="recent-item"
              key={expense.id}
            >

              {/* Icon */}

              <div
                className={`recent-icon ${
                  expense.type === "Income"
                    ? "income-icon"
                    : "expense-icon"
                }`}
              >
                {expense.type === "Income"
                  ? "💵"
                  : "💸"}
              </div>


              {/* Details */}

              <div className="recent-details">

                <h4>
                  {expense.name}
                </h4>

                <p>

                  {expense.type === "Expense"
                    ? `📂 ${expense.category}`
                    : "💵 Income"}

                  {" • "}
                                 <span>
  💳 {expense.paymentMethod || "Cash"}
</span>

{" • "}

                  📅 {expense.date}

   

                </p>

              </div>


              {/* Amount */}

              <div
                className={`recent-amount ${
                  expense.type === "Income"
                    ? "recent-income"
                    : "recent-expense"
                }`}
              >

                {expense.type === "Income"
                  ? "+"
                  : "-"}
                ₹{expense.amount}

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default RecentTransactions;