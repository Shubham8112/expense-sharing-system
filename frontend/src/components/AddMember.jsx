import { useState } from "react";
import API from "../api";

function AddMember({ refreshMembers }) {
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name) return;

    try {
      await API.post("/members", { name });
      setName("");
      refreshMembers();
      alert("Member added");
    } catch (err) {
      alert(err.response?.data?.message || "Error adding member");
    }
  };

  return (
    <div>
      <h2>Add Member</h2>
      <input
        type="text"
        placeholder="Enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}

export default AddMember;
