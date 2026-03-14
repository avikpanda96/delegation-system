import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Delegations() {
  const { user, loading } = useAuth();
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const load = () => {
    API.get("/delegations")
      .then((res) => setList(res.data))
      .catch((err) => {
        console.error("Fetch error:", err);
        setList([]);
      });
  };

  // 🔹 REFRESH DATA logic: clears old data and loads new data
  useEffect(() => {
    if (user) {
      load();
    } else {
      setList([]); // Clear old data on logout
    }
  }, [user]);

  // 🔹 GUARD 1: If Auth is still working, show NOTHING or a Spinner
  // This prevents the "Access Denied" flash
  if (loading) {
    return (
      <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ padding: "20px" }}>Loading your profile...</div>
      </div>
    );
  }

  // 🔹 GUARD 2: Only if loading is FINISHED and user is still null
  if (!user) {
    return (
      <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ padding: "20px" }}>Access Denied. Please Login.</div>
      </div>
    );
  }

  const create = async () => {
    if (!title || !assignedTo) return alert("Enter title and User ID");
    try {
      await API.post("/delegations", {
        title,
        description: "Task assigned by admin",
        assigned_to: assignedTo,
      });
      setTitle("");
      setAssignedTo("");
      load();
    } catch (err) {
      alert("Failed to create: " + err.response?.data?.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/delegations/${id}`, { status });
      load();
    } catch (err) { console.error(err); }
  };

  const deleteDelegation = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await API.delete(`/delegations/${id}`);
        load();
      } catch (err) { console.error(err); }
    }
  };

  return (
    <div style={{ background: "#f3f4f6", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.container}>
        <h1>Delegations</h1>

        {/* Admin Create Box */}
        {user?.role === "admin" && (
          <div style={styles.createBox}>
            <input style={styles.input} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input style={{ ...styles.input, width: "100px" }} placeholder="User ID" type="number" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
            <button style={styles.button} onClick={create}>Create</button>
          </div>
        )}

        <table style={styles.table}>
          <thead>
            <tr style={{background: "#eee"}}>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id} style={{borderBottom: "1px solid #ddd"}}>
                <td style={styles.td}>{d.title}</td>
                <td style={styles.td}>{d.status}</td>
                <td style={styles.td}>
                  {(user?.role === "admin" || (user?.role === "user" && d.assigned_to === user?.id)) && d.status !== "completed" && (
                    <button style={styles.actionButton} onClick={() => updateStatus(d.id, "completed")}>Mark Done</button>
                  )}
                  {user?.role === "superadmin" && (
                    <button onClick={() => deleteDelegation(d.id)} style={styles.deleteBtn}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p style={{ marginTop: "20px" }}>No delegations found.</p>}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "1000px", margin: "0 auto" },
  createBox: { display: "flex", gap: "10px", marginBottom: "20px", background: "#fff", padding: "15px", borderRadius: "8px" },
  input: { flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
  button: { padding: "8px 15px", borderRadius: "5px", border: "none", background: "#4f46e5", color: "#fff", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" },
  th: { padding: "12px", textAlign: "left" },
  td: { padding: "12px" },
  actionButton: { padding: "5px 10px", background: "#10b981", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer", marginRight: "5px" },
  deleteBtn: { padding: "5px 10px", background: "#f87171", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
};
