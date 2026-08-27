import jsPDF from "jspdf";

function ExportPDF({ expenses }) {

  const exportPDF = () => {

    if (expenses.length === 0) {
      alert("No transactions available for the report.");
      return;
    }

    const doc = new jsPDF();

    // =========================
    // TITLE
    // =========================

    doc.setFontSize(20);
    doc.text("Expense Tracker Report", 20, 20);

    doc.setFontSize(11);

    const today = new Date().toLocaleDateString();

    doc.text(`Generated on: ${today}`, 20, 30);


    // =========================
    // SUMMARY
    // =========================

    const income = expenses
      .filter(
        (expense) =>
          expense.type === "Income"
      )
      .reduce(
        (sum, expense) =>
          sum + Number(expense.amount),
        0
      );

    const expenseTotal = expenses
      .filter(
        (expense) =>
          expense.type === "Expense"
      )
      .reduce(
        (sum, expense) =>
          sum + Number(expense.amount),
        0
      );

    const balance =
      income - expenseTotal;


    doc.setFontSize(14);
    doc.text("Financial Summary", 20, 45);

    doc.setFontSize(11);

    doc.text(
      `Total Income: Rs. ${income}`,
      20,
      55
    );

    doc.text(
      `Total Expenses: Rs. ${expenseTotal}`,
      20,
      63
    );

    doc.text(
      `Balance: Rs. ${balance}`,
      20,
      71
    );


    // =========================
    // TRANSACTIONS
    // =========================

    doc.setFontSize(14);

    doc.text(
      "Transactions",
      20,
      88
    );

    doc.setFontSize(9);

    let y = 98;


    // HEADER

    doc.text("Name", 20, y);
    doc.text("Amount", 70, y);
    doc.text("Type", 105, y);
    doc.text("Category", 135, y);
    doc.text("Date", 175, y);

    y += 7;


    // =========================
    // TRANSACTION DATA
    // =========================

    expenses.forEach((expense) => {

      // New page if necessary

      if (y > 275) {

        doc.addPage();

        y = 20;

        doc.setFontSize(9);

        doc.text("Name", 20, y);
        doc.text("Amount", 70, y);
        doc.text("Type", 105, y);
        doc.text("Category", 135, y);
        doc.text("Date", 175, y);

        y += 7;
      }


      doc.text(
        String(expense.name || ""),
        20,
        y
      );

      doc.text(
        `Rs. ${expense.amount}`,
        70,
        y
      );

      doc.text(
        String(expense.type || ""),
        105,
        y
      );

      doc.text(
        String(
          expense.category || "-"
        ),
        135,
        y
      );

      doc.text(
        String(expense.date || ""),
        175,
        y
      );

      y += 7;

    });


    // =========================
    // SAVE
    // =========================

    doc.save(
      "expense-tracker-report.pdf"
    );

  };


  return (

    <button
      className="export-pdf-btn"
      onClick={exportPDF}
    >
      📄 Export PDF
    </button>

  );
}

export default ExportPDF;   