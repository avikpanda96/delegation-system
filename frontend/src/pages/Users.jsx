import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

  const [editUser, setEditUser] = useState(null); // editing role

  const loadUsers = async () => {
    if (user.role === "user") {
      setUsers([user]);
    } else {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) loadUsers();
  }, [user]);

  // Create user
  const handleCreate = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) return alert("Fill all fields");
    try {
      await API.post("/users", newUser);
      setShowCreate(false);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating user");
    }
  };

  // Edit role
  const handleEdit = async () => {
    if (!editUser) return;
    try {
      await API.put(`/users/${editUser.id}`, { role: editUser.role });
      setEditUser(null);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error updating role");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting user");
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1 style={styles.title}>User Management</h1>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <div style={styles.infoBox}>
            <h2>You are a normal user</h2>
            <p>You can see your assigned delegations in the Delegations page.</p>
          </div>
        ) : (
          <>
            {/* Show Create button only for Superadmin */}
            {user.role === "superadmin" && (
              <button style={styles.createBtn} onClick={() => setShowCreate(true)}>
                + Add New User
              </button>
            )}

            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  {user.role === "superadmin" && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    {user.role === "superadmin" && (
                      <td>
                        <button
                          style={styles.actionBtn}
                          onClick={() => setEditUser({ id: u.id, role: u.role })}
                        >
                          Edit Role
                        </button>
                        <button
                          style={{ ...styles.actionBtn, background: "#ef4444" }}
                          onClick={() => handleDelete(u.id)}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Create Modal */}
        {showCreate && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Create New User</h2>
              <input
                style={styles.input}
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <select
                style={styles.input}
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <div style={{ marginTop: "10px" }}>
                <button style={styles.createBtn} onClick={handleCreate}>
                  Create
                </button>
                <button
                  style={{ ...styles.createBtn, background: "#ccc", marginLeft: "10px" }}
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Role Modal */}
        {editUser && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>Edit Role</h2>
              <select
                style={styles.input}
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <div style={{ marginTop: "10px" }}>
                <button style={styles.createBtn} onClick={handleEdit}>
                  Save
                </button>
                <button
                  style={{ ...styles.createBtn, background: "#ccc", marginLeft: "10px" }}
                  onClick={() => setEditUser(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  title: { marginBottom: "20px" },
  infoBox: {
    padding: "30px",
    textAlign: "center",
    background: "#f3f4f6",
    borderRadius: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  createBtn: {
    marginBottom: "15px",
    padding: "8px 15px",
    borderRadius: "5px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
  },
  actionBtn: {
    marginRight: "10px",
    padding: "5px 10px",
    borderRadius: "5px",
    border: "none",
    background: "#10b981",
    color: "#fff",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    minWidth: "300px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
};