import { useState } from "react";

function MemberFilter({ members, debts }) {
  const [selected, setSelected] = useState("");

  const filteredDebts = debts.filter(
    (d) => d.from === selected || d.to === selected
  );

  return (
    <div>
      <h2>🔍 Member View</h2>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select member</option>
        {members.map((m) => (
          <option key={m.id} value={m.name}>
            {m.name}
          </option>
        ))}
      </select>

      <br /><br />

      {selected && (
        <>
          {filteredDebts.length === 0 ? (
            <p>No dues for this member 🎉</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {filteredDebts.map((d, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>
                  <span className="debt-pill debtor">{d.from}</span>{" "}
                  owes{" "}
                  <span className="debt-pill creditor">{d.to}</span>{" "}
                  ₹{d.amount}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default MemberFilter;
