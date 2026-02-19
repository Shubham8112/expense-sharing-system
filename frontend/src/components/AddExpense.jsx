import { useState, useEffect } from "react";
import API from "../api";

function AddExpense({ refreshDebts }) {
  const [members, setMembers] = useState([]);
  const [paidBy, setPaidBy] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const fetchMembers = async () => {
    const res = await API.get("/members");
    setMembers(res.data);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddExpense = async () => {
    if (!paidBy || !amount) {
      alert("PaidBy and amount required");
      return;
    }

    try {
      await API.post("/expenses", {
        paidBy,
        amount: Number(amount),
        description,
      });

      setAmount("");
      setDescription("");
      refreshDebts();
      alert("Expense added");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding expense");
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>

      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="">Select payer</option>
        {members.map((m) => (
          <option key={m.id} value={m.name}>
            {m.name}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <br /><br />

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br /><br />

      <button onClick={handleAddExpense}>Add Expense</button>
    </div>
  );
}

export default AddExpense;
