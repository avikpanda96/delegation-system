import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // clear auth state
    navigate("/login"); // redirect SPA
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Delegation System</div>
      <div style={styles.links}>
        <Link to="/dashboard" style={styles.link}>Dashboard</Link>
        <Link to="/delegations" style={styles.link}>Delegations</Link>
        <Link to="/reports" style={styles.link}>Reports</Link>
        {user && user.role !== "user" && <Link to="/users" style={styles.link}>Users</Link>}
        {user && (
          <button onClick={handleLogout} style={styles.logout}>Logout</button>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    background: "#4f46e5",
    color: "#fff",
  },
  logo: { fontWeight: "bold", fontSize: "20px" },
  links: { display: "flex", gap: "15px", alignItems: "center" },
  link: { color: "#fff", textDecoration: "none", fontWeight: "bold" },
  logout: {
    padding: "5px 10px",
    background: "#f87171",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    color: "#fff",
    fontWeight: "bold",
  },
};
