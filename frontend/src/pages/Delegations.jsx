import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

export default function Delegations() {
  const { user } = useAuth(); // get logged-in user
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // Load delegations
  const load = () => {
    API.get("/delegations")
      .then((res) => setList(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { load(); }, []);

  // Create new delegation (Admin only)
 const create = async () => {
  if(!title || !assignedTo) return alert("Enter title and User ID");
  try {
    await API.post("/delegations", {
      title,
      description: "Task assigned by admin",
      assigned_to: assignedTo, // Use the dynamic ID from input
    });
    setTitle("");
    setAssignedTo(""); // Reset
    load();
  } catch(err) { 
    console.error(err);
    alert("Failed to create: " + err.response?.data?.message);
  }
};

  // Update delegation status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/delegations/${id}`, { status });
      load();
    } catch(err){ console.error(err); }
  };

  // Delete delegation (Super Admin only)
  const deleteDelegation = async (id) => {
    if(window.confirm("Are you sure you want to delete this delegation?")){
      try {
        await API.delete(`/delegations/${id}`);
        load();
      } catch(err){ console.error(err); }
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Delegations</h1>

        {/* Create delegation box - only Admin can create */}
       {user?.role === "admin" && (
  <div style={styles.createBox}>
    <input
      style={styles.input}
      placeholder="Delegation Title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
    <input
      style={{ ...styles.input, width: "100px" }} // Small input for User ID
      placeholder="User ID"
      type="number"
      value={assignedTo}
      onChange={(e) => setAssignedTo(e.target.value)}
    />
    <button style={styles.button} onClick={create}>Create & Assign</button>
  </div>
)}

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map(d => (
              <tr key={d.id}>
                <td>{d.title}</td>
                <td>{d.status}</td>
                <td>
                  {/* Mark Done button (Admins + Users for their own) */}
                  {((user.role === "admin") || (user.role === "user" && d.assigned_to === user.id)) && d.status !== "completed" && 
                    <button style={styles.actionButton} 
                      onClick={()=>updateStatus(d.id,"completed")}>
                      Mark Done
                    </button>
                  }

                  {/* Delete button (Super Admin only) */}
                  {user && user.role === "superadmin" && (
                    <button 
                      onClick={() => deleteDelegation(d.id)} 
                      style={styles.deleteBtn}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* If no delegations */}
        {list.length === 0 && (
          <p style={{marginTop:"20px"}}>No delegations available.</p>
        )}

      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  createBox: { display:"flex", gap:"10px", marginBottom:"20px" },
  input: { flex:1, padding:"8px", borderRadius:"5px", border:"1px solid #ccc" },
  button: { padding:"8px 15px", borderRadius:"5px", border:"none", background:"#4f46e5", color:"#fff", cursor:"pointer" },
  table: { width:"100%", borderCollapse:"collapse", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" },
  actionButton: { padding:"5px 10px", background:"#10b981", color:"#fff", border:"none", borderRadius:"5px", cursor:"pointer", marginRight:"5px" },
  deleteBtn: { padding:"5px 10px", background:"#f87171", color:"#fff", border:"none", borderRadius:"5px", cursor:"pointer" }
};