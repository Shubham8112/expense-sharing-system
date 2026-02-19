import { useEffect, useState } from "react";
import API from "../api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    const res = await API.get("/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>📜 Transaction History</h2>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <ul>
          {transactions.map((t) => (
            <li key={t.id}>
              <b>{t.paidBy}</b> paid ₹{t.amount} — {t.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Transactions;
