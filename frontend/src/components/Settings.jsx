function Settings({ setTheme, setExpenses }) {

  // Change theme
  const changeTheme = (theme) => {
    setTheme(theme);
  };


  // Clear transactions
  const clearTransactions = () => {

    const confirmClear = window.confirm(
      "Are you sure you want to delete all transactions?"
    );

    if (!confirmClear) {
      return;
    }

    setExpenses([]);

    localStorage.removeItem("expenses");
  };


  // Clear budget
  const clearBudget = () => {

    const confirmClear = window.confirm(
      "Are you sure you want to delete your saved budget?"
    );

    if (!confirmClear) {
      return;
    }

    localStorage.removeItem("monthlyBudget");

    alert("Budget removed. Refresh the page to update.");
  };


  return (

    <div className="settings-page">

      <h2>⚙️ Settings</h2>


      {/* Appearance */}

      <div className="settings-card">

        <h3>🎨 Appearance</h3>

        <p>
          Choose how your expense tracker looks.
        </p>


        <div className="theme-buttons">

          <button
            onClick={() => changeTheme("light")}
          >
            ☀️ Light Mode
          </button>


          <button
            onClick={() => changeTheme("dark")}
          >
            🌙 Dark Mode
          </button>

        </div>

      </div>


      {/* Data */}

      <div className="settings-card">

        <h3>💾 Data Management</h3>

        <p>
          Manage your saved transactions and budget.
        </p>


        <button
          className="clear-button"
          onClick={clearTransactions}
        >
          🗑️ Clear All Transactions
        </button>


        <button
          className="clear-budget-button"
          onClick={clearBudget}
        >
          💰 Clear Saved Budget
        </button>

      </div>


      {/* Information */}

      <div className="settings-card">

        <h3>ℹ️ About</h3>

        <p>
          Expense Tracker
        </p>

        <p>
          Manage your income, expenses,
          budget and spending reports.
        </p>

      </div>

    </div>

  );
}

export default Settings;