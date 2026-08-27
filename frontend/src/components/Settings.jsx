import BackupRestore from "./BackupRestore";

function Settings({
  setTheme,
  setExpenses,
  setPage,
  onLogout,
  expenses
}) {

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    onLogout();
  };


  // =========================
  // CHANGE THEME
  // =========================

  const changeTheme = (theme) => {
    setTheme(theme);
  };


  // =========================
  // CLEAR ALL TRANSACTIONS
  // =========================

  const clearTransactions = () => {

    const confirmClear = window.confirm(
      "Are you sure you want to delete ALL transactions?"
    );

    if (!confirmClear) {
      return;
    }

    setExpenses([]);

    localStorage.removeItem("expenses");

    alert("All transactions have been deleted.");
  };


  // =========================
  // CLEAR ALL BUDGETS
  // =========================

  const clearBudget = () => {

    const confirmClear = window.confirm(
      "Are you sure you want to delete ALL saved budgets?"
    );

    if (!confirmClear) {
      return;
    }

    localStorage.removeItem("monthlyBudgets");

    alert("All saved budgets have been removed.");
  };


  // =========================
  // RESET ALL DATA
  // =========================

  const resetAllData = () => {

    const confirmReset = window.confirm(
      "WARNING!\n\nThis will delete all transactions and all budgets.\n\nAre you sure?"
    );

    if (!confirmReset) {
      return;
    }

    setExpenses([]);

    localStorage.removeItem("expenses");
    localStorage.removeItem("monthlyBudgets");

    alert("All expense tracker data has been reset.");
  };


  // =========================
  // RETURN
  // =========================

  return (

    <div className="settings-page">

      <h2>⚙️ Settings</h2>


      {/* =========================
          APPEARANCE
      ========================= */}

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


      {/* =========================
          DATA MANAGEMENT
      ========================= */}

      <div className="settings-card">

        <h3>💾 Data Management</h3>

        <p>
          Manage your saved transactions and budgets.
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
          💰 Clear Saved Budgets
        </button>

        <button
          className="reset-button"
          onClick={resetAllData}
        >
          ⚠️ Reset All Data
        </button>

      </div>


      {/* =========================
          BACKUP & RESTORE
      ========================= */}

      <div className="settings-card">

        <BackupRestore
          expenses={expenses}
          setExpenses={setExpenses}
          setPage={setPage}
        />

      </div>


      {/* =========================
          ACCOUNT
      ========================= */}

      <div className="settings-card">

        <h3>👤 Account</h3>

        <p>
          Manage your account and security.
        </p>

        <button
          onClick={() => setPage("profile")}
        >
          👤 Profile
        </button>

        <button
          onClick={() => setPage("security")}
        >
          🔐 Security
        </button>

        <button
          className="logout-button"
          onClick={logout}
        >
          🚪 Logout
        </button>

      </div>


      {/* =========================
          INFORMATION
      ========================= */}

      <div className="settings-card">

        <h3>ℹ️ About</h3>

        <p>
          Expense Tracker
        </p>

        <p>
          Manage your income, expenses,
          budgets and spending reports.
        </p>

        <p>
          Version 1.0
        </p>

      </div>

    </div>

  );
}

export default Settings;