import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Delegations() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  //user lov
const [users, setUsers] = useState([]);
const [loadingUsers, setLoadingUsers] = useState(false);
const [usersLoaded, setUsersLoaded] = useState(false);

  // Load delegations
  const load = () => {
    if (!user) return;
    API.get("/delegations")
      .then((res) => setList(res.data))
      .catch(() => setList([]));
  };

  // Reload on user change
  useEffect(() => {
    if (user) {
      load();
    } else if (!loading) {
      setList([]);       // clear old data
      navigate("/login"); // SPA redirect
    }
  }, [user, loading, navigate]);

  //user lov functinalty
  const loadUsers = async () => {
  if (usersLoaded) return;

  setLoadingUsers(true);
  try {
    const res = await API.get("/users");
    setUsers(res.data);
    setUsersLoaded(true);
  } catch (err) {
    console.error(err);
  }
  setLoadingUsers(false);
};

  // Create delegation
  const create = async () => {
    if (!title || !assignedTo) return alert("Enter title and User ID");
    try {
      await API.post("/delegations", {
        title,
        description: "Assigned Task",
        assigned_to: assignedTo,
      });
      setTitle("");
      setAssignedTo("");
      load();
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || "Server Error"));
    }
  };

  // Update status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/delegations/${id}`, { status });
      load();
    } catch (err) { console.error(err); }
  };

  // Delete delegation
  const deleteDelegation = async (id) => {
    if (window.confirm("Delete this delegation?")) {
      try {
        await API.delete(`/delegations/${id}`);
        load();
      } catch (err) { console.error(err); }
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
        <Navbar />
        <div style={styles.container}>
          <h3>Authenticating...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6" }}>
      <Navbar />

      <div style={styles.container}>
        <h1>Delegations</h1>

        {user?.role === "admin" && (
          <div style={styles.createBox}>
            <input
              style={styles.input}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
           <select
  style={{ ...styles.input, width: "250px" }}
  value={assignedTo}
  onChange={(e) => setAssignedTo(Number(e.target.value))}
  onClick={loadUsers}
>
  <option value="">
    {loadingUsers ? "Loading users..." : "Select user"}
  </option>

  {users.map((u) => (
    <option key={u.id} value={u.id}>
      {u.id} | {u.name} | {u.email}
    </option>
  ))}
</select>
            <button style={styles.button} onClick={create}>
              Create & Assign
            </button>
          </div>
        )}

        <table style={styles.table}>
          <thead>
            <tr style={{ background: "#eee" }}>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((d) => (
              <tr key={d.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={styles.td}>{d.title}</td>
                <td style={styles.td}>{d.status}</td>
                <td style={styles.td}>
                  {(user.role === "admin" ||
                    (user.role === "user" && d.assigned_to === user.id)) &&
                    d.status !== "completed" && (
                      <button
                        style={styles.actionButton}
                        onClick={() => updateStatus(d.id, "completed")}
                      >
                        Mark Done
                      </button>
                    )}
                  {user.role === "superadmin" && (
                    <button
                      onClick={() => deleteDelegation(d.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {list.length === 0 && (
          <p style={{ marginTop: "20px" }}>No delegations available.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "1000px", margin: "0 auto" },
  createBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
  },
  input: { flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" },
  button: {
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: { padding: "12px", textAlign: "left" },
  td: { padding: "12px" },
  actionButton: {
    padding: "5px 10px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "5px",
  },
  deleteBtn: {
    padding: "5px 10px",
    background: "#f87171",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};
