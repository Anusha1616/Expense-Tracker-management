function PaymentMethodChart({ expenses }) {

  // =========================
  // PAYMENT METHODS
  // =========================

  const paymentMethods = [
    {
      name: "Cash",
      icon: "💵"
    },
    {
      name: "UPI",
      icon: "📱"
    },
    {
      name: "Debit Card",
      icon: "💳"
    },
    {
      name: "Credit Card",
      icon: "💳"
    },
    {
      name: "Bank Transfer",
      icon: "🏦"
    }
  ];


  // =========================
  // CALCULATE PAYMENT DATA
  // =========================

  const paymentData = paymentMethods.map((method) => {

    const transactions = expenses.filter(
      (expense) =>
        (expense.paymentMethod || "Cash") === method.name &&
        expense.type === "Expense"
    );


    const total = transactions.reduce(
      (sum, expense) =>
        sum + Number(expense.amount),
      0
    );


    return {
      ...method,
      count: transactions.length,
      total: total
    };

  });


  // =========================
  // RETURN
  // =========================

  return (

    <div className="payment-method-card">


      {/* TITLE */}

      <h3>
        💳 Payment Methods
      </h3>


      {/* PAYMENT METHOD LIST */}

      <div className="payment-method-list">

        {paymentData.map((item) => (

          <div
            className="payment-method-row"
            key={item.name}
          >


            {/* =========================
                LEFT SIDE
            ========================= */}

            <div className="payment-method-info">


              {/* ICON */}

              <div className="payment-method-icon">

                {item.icon}

              </div>


              {/* NAME + COUNT */}

              <div className="payment-method-name">

                <strong>
                  {item.name}
                </strong>


                <span>

                  {item.count}

                  {" "}

                  transaction

                  {item.count !== 1
                    ? "s"
                    : ""}

                </span>

              </div>


            </div>


            {/* =========================
                RIGHT SIDE
            ========================= */}

            <div className="payment-method-amount">

              ₹{item.total}

            </div>


          </div>

        ))}

      </div>


    </div>

  );

}


export default PaymentMethodChart;