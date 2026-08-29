import API from "../api/api";

function BackupRestore({
  expenses,
  setExpenses,
  setPage
}) {

  // =========================
  // BACKUP DATA
  // =========================

  const backupData = async () => {

  try {

    // =========================
    // GET BUDGETS FROM MONGODB
    // =========================

    const budgetResponse = await API.get(
      "/budgets"
    );

    const budgets = {};

    budgetResponse.data.budgets.forEach(
      (budget) => {

        budgets[budget.month] =
          budget.amount;

      }
    );


    // =========================
    // EXPENSES
    // =========================

    const savedExpenses =
      expenses || [];


    // =========================
    // CREATE BACKUP
    // =========================

    const backup = {

      app: "Expense Tracker",

      version: "1.0",

      createdAt:
        new Date().toISOString(),

      expenses:
        savedExpenses,

      budgets:
        budgets

    };


    // =========================
    // DOWNLOAD JSON
    // =========================

    const json =
      JSON.stringify(
        backup,
        null,
        2
      );

    const blob =
      new Blob(
        [json],
        {
          type:
            "application/json"
        }
      );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "expense-tracker-backup.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);


    alert(
      "✅ Backup downloaded successfully!"
    );

  } catch (error) {

    console.error(
      "Backup error:",
      error
    );

    alert(
      error.response?.data?.message ||
      "❌ Unable to create backup."
    );

  }

};

  // =========================
  // RESTORE DATA
  // =========================

 const restoreData = (event) => {

  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  const confirmRestore = window.confirm(
    "⚠️ Restoring this backup will replace your current transactions and budgets. Continue?"
  );

  if (!confirmRestore) {
    event.target.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = async (e) => {

    try {

      const backup = JSON.parse(
        e.target.result
      );

      // =========================
      // VALIDATE BACKUP
      // =========================

      if (
        !backup ||
        backup.app !== "Expense Tracker" ||
        !Array.isArray(backup.expenses) ||
        !backup.budgets ||
        typeof backup.budgets !== "object" ||
        Array.isArray(backup.budgets)
      ) {
        throw new Error(
          "Invalid backup structure"
        );
      }


      // =========================
      // RESTORE TRANSACTIONS
      // =========================

      const response = await API.post(
        "/expenses/restore",
        {
          expenses: backup.expenses
        }
      );

      console.log(
        "Restored transactions:",
        response.data
      );


      // =========================
      // UPDATE FRONTEND
      // =========================

      setExpenses(
        response.data.expenses
      );


      // =========================
      // RESTORE BUDGETS
      // =========================
      // =========================
// RESTORE BUDGETS
// =========================

const budgetResponse = await API.post(
  "/budgets/restore",
  {
    budgets: backup.budgets
  }
);

console.log(
  "Restored budgets:",
  budgetResponse.data
);



      // =========================
      // SUCCESS
      // =========================

      alert(
        "✅ Data restored successfully!"
      );


      if (setPage) {
        setPage("dashboard");
      }


    } catch (error) {

      console.error(
        "Restore error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "❌ Unable to restore backup."
      );

    }

  };


  reader.onerror = () => {

    alert(
      "❌ Unable to read the backup file."
    );

  };


  reader.readAsText(file);

  event.target.value = "";
};

  return (

    <div className="backup-restore">

      <h3>
        💾 Backup & Restore
      </h3>

      <p>
        Backup your transactions and
        monthly budgets or restore them
        from a previous backup.
      </p>


      {/* =========================
          BACKUP
      ========================= */}

      <button
        type="button"
        className="backup-button"
        onClick={backupData}
      >
        📥 Backup Data
      </button>


      {/* =========================
          RESTORE
      ========================= */}

      <label
        className="restore-button"
      >

        📤 Restore Data

        <input
          type="file"
          accept=".json,application/json"
          onChange={restoreData}
          hidden
        />

      </label>

    </div>

  );

}


export default BackupRestore;