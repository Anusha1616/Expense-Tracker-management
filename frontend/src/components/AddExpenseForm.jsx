import { useState } from "react";
import API from "../api/api";

function AddExpenseForm({ expenses, setExpenses }) {

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Expense");
  const [category, setCategory] = useState("Food");
  const [date, setDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [loading, setLoading] = useState(false);


  // =====================================================
  // ADD EXPENSE / INCOME
  // =====================================================

  async function addExpense() {

    // Check required fields
    if (name === "" || amount === "" || date === "") {

      alert("Please enter all fields");

      return;
    }


    try {

      // Start loading
      setLoading(true);


      // Data to send to backend
      const transactionData = {

        name: name,

        amount: Number(amount),

        type: type,

        category: type === "Expense"
          ? category
          : "",

        date: date,

        paymentMethod: paymentMethod

      };


      console.log(
        "Sending to backend:",
        transactionData
      );


      // =====================================================
      // SEND DATA TO BACKEND
      // =====================================================

      const response = await API.post(
        "/expenses",
        transactionData
      );


      console.log(
        "Backend response:",
        response.data
      );


      // =====================================================
      // ADD BACKEND RESPONSE TO FRONTEND
      // =====================================================

      const newExpense = response.data.expense;


      setExpenses([
        ...expenses,
        newExpense
      ]);


      // =====================================================
      // CLEAR FORM
      // =====================================================

      setName("");
      setAmount("");
      setType("Expense");
      setCategory("Food");
      setDate("");
      setPaymentMethod("Cash");


      alert(
        type === "Income"
          ? "Income added successfully!"
          : "Expense added successfully!"
      );


    } catch (error) {

      console.error(
        "Add transaction error:",
        error
      );


      if (error.response) {

        console.error(
          "Backend error:",
          error.response.data
        );


        alert(
          error.response.data.message ||
          "Failed to add transaction"
        );

      } else {

        alert(
          "Cannot connect to backend. Make sure the server is running."
        );

      }


    } finally {

      setLoading(false);

    }

  }


  return (

    <div className="add-expense-form">


      {/* =====================================================
          TITLE
      ===================================================== */}

      <h2>

        {type === "Income"
          ? "Add New Income"
          : "Add New Expense"}

      </h2>


      {/* =====================================================
          NAME
      ===================================================== */}

      <div className="form-group">

        <label>

          {type === "Income"
            ? "Income Name"
            : "Expense Name"}

        </label>


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

      </div>


      {/* =====================================================
          AMOUNT
      ===================================================== */}

      <div className="form-group">

        <label>
          Amount
        </label>


        <input

          type="number"

          placeholder="Enter amount"

          value={amount}

          onChange={(e) =>
            setAmount(e.target.value)
          }

        />

      </div>


      {/* =====================================================
          TYPE
      ===================================================== */}

      <div className="form-group small-field">

        <label>
          Type
        </label>


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

      </div>


      {/* =====================================================
          CATEGORY
      ===================================================== */}

      {type === "Expense" && (

        <div className="form-group small-field">

          <label>
            Category
          </label>


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

        </div>

      )}


      {/* =====================================================
          DATE
      ===================================================== */}

      <div className="form-group">

        <label>
          Date
        </label>


        <input

          type="date"

          value={date}

          onChange={(e) =>
            setDate(e.target.value)
          }

        />

      </div>


      {/* =====================================================
          PAYMENT METHOD
      ===================================================== */}

      <div className="form-group small-field">

        <label>
          💳 Payment Method
        </label>


        <select

          value={paymentMethod}

          onChange={(e) =>
            setPaymentMethod(e.target.value)
          }

        >

          <option value="Cash">
            💵 Cash
          </option>

          <option value="UPI">
            📱 UPI
          </option>

          <option value="Debit Card">
            💳 Debit Card
          </option>

          <option value="Credit Card">
            💳 Credit Card
          </option>

          <option value="Bank Transfer">
            🏦 Bank Transfer
          </option>

        </select>

      </div>


      {/* =====================================================
          ADD BUTTON
      ===================================================== */}

      <button

        className="add-expense-button"

        onClick={addExpense}

        disabled={loading}

      >

        {loading

          ? "Saving..."

          : type === "Income"
            ? "Add Income"
            : "Add Expense"

        }

      </button>


    </div>

  );

}


export default AddExpenseForm;