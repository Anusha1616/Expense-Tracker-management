import { useState } from "react";

function AddIncome({ expenses, setExpenses }) {

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  // 1. ADD THIS
  const [date, setDate] = useState("");

  function addIncome() {

    if (name === "" || amount === "") {
      alert("Please enter all fields");
      return;
    }

    // 2. ADD date HERE
    const newIncome = {
      id: Date.now(),
      name: name,
      amount: Number(amount),
      type: "Income",
      date: date
    };

    setExpenses([...expenses, newIncome]);

    setName("");
    setAmount("");

    // 3. ADD THIS
    setDate("");
  }

  return (
    <div>

      <h2>Add New Income</h2>

      <label>Income Name</label>
      <br />

      <input
        type="text"
        placeholder="Enter income name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <br />
      <br />

      <label>Amount</label>
      <br />

      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br />
      <br />

      {/* 4. ADD DATE HERE */}
      <label>Date</label>
      <br />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <br />
      <br />

      <label>Type</label>
      <br />

      <select value="Income" disabled>
        <option value="Income">Income</option>
      </select>

      <br />
      <br />

      <button onClick={addIncome}>
        Add Income
      </button>

    </div>
  );
}

export default AddIncome;