function BackupRestore({
  expenses,
  setExpenses,
  setPage
}) {

  // =========================
  // BACKUP DATA
  // =========================

  const backupData = () => {

    try {

      const savedExpenses =
        expenses ||
        JSON.parse(
          localStorage.getItem("expenses") || "[]"
        );

      const savedBudgets =
        JSON.parse(
          localStorage.getItem("monthlyBudgets") || "{}"
        );

      const backup = {
        app: "Expense Tracker",
        version: "1.0",
        createdAt: new Date().toISOString(),
        expenses: savedExpenses,
        budgets: savedBudgets
      };

      const json = JSON.stringify(
        backup,
        null,
        2
      );

      const blob = new Blob(
        [json],
        {
          type: "application/json"
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
        "❌ Unable to create backup."
      );

    }

  };


  // =========================
  // RESTORE DATA
  // =========================

  const restoreData = (event) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    const confirmRestore =
      window.confirm(
        "⚠️ Restoring this backup will replace your current transactions and budgets. Continue?"
      );

    if (!confirmRestore) {

      event.target.value = "";

      return;

    }


    const reader =
      new FileReader();


    reader.onload = (e) => {

      try {

        const backup =
          JSON.parse(
            e.target.result
          );


        // =========================
        // VALIDATE BACKUP
        // =========================

        if (
          !backup ||
          backup.app !== "Expense Tracker" ||
          !Array.isArray(
            backup.expenses
          ) ||
          !backup.budgets ||
          typeof backup.budgets !==
            "object" ||
          Array.isArray(
            backup.budgets
          )
        ) {

          throw new Error(
            "Invalid backup structure"
          );

        }


        // =========================
        // RESTORE EXPENSES
        // =========================

        localStorage.setItem(
          "expenses",
          JSON.stringify(
            backup.expenses
          )
        );


        setExpenses(
          backup.expenses
        );


        // =========================
        // RESTORE BUDGETS
        // =========================

        localStorage.setItem(
          "monthlyBudgets",
          JSON.stringify(
            backup.budgets
          )
        );


        // =========================
        // SUCCESS
        // =========================

        alert(
          "✅ Data restored successfully!"
        );


        // Optional: go to dashboard

        if (setPage) {

          setPage("dashboard");

        }


      } catch (error) {

        console.error(
          "Restore error:",
          error
        );

        alert(
          "❌ Invalid or corrupted backup file."
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