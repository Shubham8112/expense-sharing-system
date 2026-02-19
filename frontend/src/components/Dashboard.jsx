function Dashboard({ debts }) {
  return (
    <div>
      <h2>📊 Debts Dashboard</h2>

      {debts.length === 0 ? (
        <p>No debts 🎉</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {debts.map((d, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <span className="debt-pill debtor">{d.from}</span>{" "}
              owes{" "}
              <span className="debt-pill creditor">{d.to}</span>{" "}
              ₹{d.amount}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Dashboard;
