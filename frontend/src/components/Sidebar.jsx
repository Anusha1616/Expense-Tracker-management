function Sidebar({ setPage }) {
  return (
    <div className="sidebar">

      <h2 className="logo">
        💰 Expense Tracker
      </h2>

      <ul>

        <li onClick={() => setPage("dashboard")}>
          🏠 Dashboard
        </li>

        <li onClick={() => setPage("transactions")}>
          💳 Transactions
        </li>

        <li onClick={() => setPage("reports")}>
          📊 Reports/Charts
        </li>

        <li onClick={() => setPage("budget")}>
          💰 Budget
        </li>

        <li onClick={() => setPage("settings")}>
          ⚙️ Settings
        </li>

      </ul>

    </div>
  );
}

export default Sidebar;