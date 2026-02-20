import { useEffect, useState } from "react";
import API from "./api";
import AddMember from "./components/AddMember";
import AddExpense from "./components/AddExpense";
import Dashboard from "./components/Dashboard";
import MemberFilter from "./components/MemberFilter";
import Transactions from "./components/Transactions";

function App() {
  const [members, setMembers] = useState([]);
  const [debts, setDebts] = useState([]);

  const fetchMembers = async () => {
    const res = await API.get("/members");
    setMembers(res.data);
  };

  const fetchDebts = async () => {
    const res = await API.get("/debts");
    setDebts(res.data);
  };

  useEffect(() => {
    fetchMembers();
    fetchDebts();
  }, []);

  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>
        💰 Expense Sharing System
      </h1>

      <div className="card">
        <AddMember refreshMembers={fetchMembers} />
      </div>

      <div className="card">
        <AddExpense refreshDebts={fetchDebts} />
      </div>

      <div className="card">
        <h2>👥 Members</h2>
        <ul>
          {members.map((m) => (
            <li key={m.id} style={{ marginBottom: "6px" }}>
              {m.name}{" "}
              <button
                style={{ background: "crimson", marginLeft: "10px" }}
                onClick={async () => {
                  try {
                    await API.delete(`/members/${m.id}`);
                    fetchMembers();
                    fetchDebts();
                  } catch (err) {
                    alert("Error deleting member");
                  }
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <Dashboard debts={debts} />
      </div>
      <div className="card">
        <MemberFilter members={members} debts={debts} />
      </div>

      <div className="card">
        <Transactions />
      </div>

    </div>
  );

}

export default App;
