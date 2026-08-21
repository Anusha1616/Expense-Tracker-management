import { useState } from "react";

function AddExpenseForm({ expenses, setExpenses }) {

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");


  // =========================
  // ADD INCOME / EXPENSE
  // =========================

  function addExpense() {

    // Check required fields
    if (name === "" || amount === "" || date === "") {

      alert("Please enter all fields");

      return;
    }


    // Create new transaction
    const newExpense = {

      // Unique ID
      id: Date.now(),

      // Transaction name
      name: name,

      // Amount
      amount: Number(amount),

      // Income or Expense
      type: type,

      // Category only for Expense
      category: type === "Expense"
        ? category
        : "",

      // Date
      date: date,

    };


    // Add transaction to existing transactions
    setExpenses([
      ...expenses,
      newExpense
    ]);


    // Clear form
    setName("");
    setAmount("");
    setType("Expense");
    setCategory("Food");
    setDate("");

  }


  return (

    <div>

      {/* =========================
          TITLE
      ========================= */}

      <h2>
        {type === "Income"
          ? "Add New Income"
          : "Add New Expense"}
      </h2>


      {/* =========================
          NAME
      ========================= */}

      <label>

        {type === "Income"
          ? "Income Name"
          : "Expense Name"}

      </label>

      <br />

      <input
        type="text"

        placeholder={
          type === "Income"
            ? "Enter income name"
            : "Enter expense name"
        }

        value={name}

        onChange={(e) =>
          setName(e.target.value)
        }
      />


      <br />
      <br />


      {/* =========================
          AMOUNT
      ========================= */}

      <label>Amount</label>

      <br />

      <input
        type="number"
        placeholder="Enter amount"

        value={amount}

        onChange={(e) =>
          setAmount(e.target.value)
        }
      />


      <br />
      <br />


      {/* =========================
          TYPE
      ========================= */}

      <label>Type</label>

      <br />

      <select
        value={type}

        onChange={(e) =>
          setType(e.target.value)
        }
      >

        <option value="Expense">
          Expense
        </option>

        <option value="Income">
          Income
        </option>

      </select>


      <br />
      <br />


      {/* =========================
          CATEGORY
          ONLY FOR EXPENSE
      ========================= */}

      {type === "Expense" && (

        <>

          <label>Category</label>

          <br />

          <select
            value={category}

            onChange={(e) =>
              setCategory(e.target.value)
            }
          >

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

          <br />
          <br />

        </>

      )}


      {/* =========================
          DATE
          FOR BOTH
      ========================= */}

      <label>Date</label>

      <br />

      <input
        type="date"

        value={date}

        onChange={(e) =>
          setDate(e.target.value)
        }
      />


      <br />
      <br />


      {/* =========================
          ADD BUTTON
      ========================= */}

      <button onClick={addExpense}>

        {type === "Income"
          ? "Add Income"
          : "Add Expense"}

      </button>

    </div>

  );
}

export default AddExpenseForm;