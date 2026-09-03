import { useState } from "react";

function Sidebar({ setPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePageChange = (page) => {
    setPage(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>

        <h2 className="logo">
          💰 Expense Tracker
        </h2>

        <ul>

          <li onClick={() => handlePageChange("dashboard")}>
            🏠 Dashboard
          </li>

          <li onClick={() => handlePageChange("transactions")}>
            💳 Transactions
          </li>

          <li onClick={() => handlePageChange("reports")}>
            📊 Reports/Charts
          </li>

          <li onClick={() => handlePageChange("budget")}>
            💰 Budget
          </li>

          <li onClick={() => handlePageChange("settings")}>
            ⚙️ Settings
          </li>

        </ul>

      </div>
    </>
  );
}

export default Sidebar;