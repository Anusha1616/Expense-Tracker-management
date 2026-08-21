import { useState } from "react";

function ExpenseList({
  expenses,
  deleteExpense,
  editExpense,
  selectedMonth,
  setSelectedMonth
}) {

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // =========================
  // SEARCH + FILTER + MONTH
  // =========================

  const filteredExpenses = expenses.filter((expense) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      (expense.name || "")
        .toLowerCase()
        .includes(searchText) ||

      (expense.type || "")
        .toLowerCase()
        .includes(searchText) ||

      (expense.category || "")
        .toLowerCase()
        .includes(searchText);

    const matchesFilter =
      filter === "All" ||
      expense.type === filter ||
      expense.category === filter;

    const matchesMonth =
      selectedMonth === "All" ||
      expense.date?.startsWith(selectedMonth);

    return matchesSearch && matchesFilter && matchesMonth;

  }); // ⭐ IMPORTANT: closes filter()

  return (

    <div className="expense-list">

      {/* =========================
          TITLE
      ========================= */}

      <h2>💳 Transaction List</h2>


      {/* =========================
          MONTH FILTER
      ========================= */}

      <div className="month-filter">

        <label>📅 Month: </label>

        <select
          value={selectedMonth}
          onChange={(e) =>
            setSelectedMonth(e.target.value)
          }
        >

          <option value="All">
            All Months
          </option>

          <option value="2026-01">
            January 2026
          </option>

          <option value="2026-02">
            February 2026
          </option>

          <option value="2026-03">
            March 2026
          </option>

          <option value="2026-04">
            April 2026
          </option>

          <option value="2026-05">
            May 2026
          </option>

          <option value="2026-06">
            June 2026
          </option>

          <option value="2026-07">
            July 2026
          </option>

          <option value="2026-08">
            August 2026
          </option>

          <option value="2026-09">
            September 2026
          </option>

          <option value="2026-10">
            October 2026
          </option>

          <option value="2026-11">
            November 2026
          </option>

          <option value="2026-12">
            December 2026
          </option>

        </select>

      </div>


      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <div className="transaction-controls">

        {/* SEARCH */}

        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search transactions..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />


        {/* FILTER */}

        <select
          className="filter-select"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >

          <option value="All">
            All Transactions
          </option>

          <option value="Income">
            💵 Income
          </option>

          <option value="Expense">
            💸 Expense
          </option>

          <option value="Food">
            🍔 Food
          </option>

          <option value="Travel">
            ✈️ Travel
          </option>

          <option value="Shopping">
            🛍️ Shopping
          </option>

          <option value="Bills">
            🧾 Bills & Utilities
          </option>

          <option value="Education">
            🎓 Education
          </option>

          <option value="Health">
            🏥 Health & Medical
          </option>

          <option value="Entertainment">
            🎬 Entertainment
          </option>

          <option value="Rent">
            🏠 Rent
          </option>

          <option value="Transportation">
            🚗 Transportation
          </option>

          <option value="Fuel">
            ⛽ Fuel
          </option>

          <option value="Groceries">
            🛒 Groceries
          </option>

          <option value="Subscriptions">
            📱 Subscriptions
          </option>

          <option value="Clothing">
            👕 Clothing
          </option>

          <option value="Fitness">
            💪 Fitness & Gym
          </option>

          <option value="Insurance">
            🛡️ Insurance
          </option>

          <option value="Investments">
            📈 Investments
          </option>

          <option value="Gifts">
            🎁 Gifts
          </option>

          <option value="Family">
            👨‍👩‍👧 Family
          </option>

          <option value="Personal">
            👤 Personal
          </option>

          <option value="Other">
            📦 Other
          </option>

        </select>

      </div>


      {/* =========================
          NO TRANSACTIONS
      ========================= */}

      {filteredExpenses.length === 0 ? (

        <div className="no-transactions">

          <h3>📭 No transactions found</h3>

          <p>
            Try adding a transaction or
            changing your search/filter.
          </p>

        </div>

      ) : (

        /* =========================
           TRANSACTION CARDS
        ========================= */

        <div className="transactions-container">

          {filteredExpenses.map((expense) => {

            const originalIndex =
              expenses.findIndex(
                (item) =>
                  item.id === expense.id
              );

            return (

              <div
                className={`transaction-card-item ${
                  expense.type === "Income"
                    ? "income-transaction"
                    : "expense-transaction"
                }`}
                key={expense.id}
              >

                {/* LEFT SIDE */}

                <div className="transaction-info">

                  <h3>
                    {expense.name}
                  </h3>

                  <div className="transaction-details">

                    <span>
                      {expense.type === "Income"
                        ? "💵 Income"
                        : "💸 Expense"}
                    </span>

                    {expense.type === "Expense" && (

                      <span>
                        📂 {expense.category}
                      </span>

                    )}

                    <span>
                      📅 {expense.date}
                    </span>

                  </div>

                </div>


                {/* AMOUNT */}

                <div
                  className={`transaction-amount ${
                    expense.type === "Income"
                      ? "income-amount"
                      : "expense-amount"
                  }`}
                >

                  {expense.type === "Income"
                    ? "+"
                    : "-"}
                  ₹{expense.amount}

                </div>


                {/* BUTTONS */}

                <div className="transaction-actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editExpense(
                        originalIndex
                      )
                    }
                  >
                    ✏️ Edit
                  </button>


                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteExpense(
                        originalIndex
                      )
                    }
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            );

          })}

        </div>

      )}

    </div>

  );
}

export default ExpenseList;