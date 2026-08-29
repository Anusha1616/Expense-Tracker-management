import BackupRestore from "./BackupRestore";
import API from "../api/api";

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
const clearTransactions = async () => {

  const confirmClear = window.confirm(
    "Are you sure you want to delete ALL transactions?"
  );

  if (!confirmClear) {
    return;
  }

  try {

    // await API.delete("/expenses/all");
    await API.delete("/expenses");

    setExpenses([]);

    alert("All transactions have been deleted.");

  } catch (error) {

    console.error(
      "Clear transactions error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to delete transactions"
    );

  }
};

  // =========================
  // CLEAR ALL BUDGETS
  // =========================
const clearBudget = async () => {

  const confirmClear = window.confirm(
    "Are you sure you want to delete ALL saved budgets?"
  );

  if (!confirmClear) {
    return;
  }

  try {

    const response = await API.delete("/budgets");

    console.log(
      "Budgets deleted:",
      response.data
    );

    // Remove old localStorage data if it still exists
    localStorage.removeItem("monthlyBudgets");

    alert("All saved budgets have been removed.");

  } catch (error) {

    console.error(
      "Clear budgets error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to delete budgets"
    );
  }
};
  // =========================
  // RESET ALL DATA
  // =========================

 const resetAllData = async () => {

  const confirmReset = window.confirm(
    "WARNING!\n\nThis will delete all transactions and all budgets.\n\nAre you sure?"
  );

  if (!confirmReset) {
    return;
  }

  try {

    // Delete all transactions from MongoDB
    await API.delete("/expenses/all");

    // Clear frontend transactions
    setExpenses([]);

    // Clear locally stored budgets
    localStorage.removeItem("monthlyBudgets");

    // Remove old localStorage transactions if any
    localStorage.removeItem("expenses");

    alert(
      "All expense tracker data has been reset."
    );

  } catch (error) {

    console.error(
      "Reset all data error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "Failed to reset all data"
    );

  }
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