
import { useEffect, useState } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import ChartBox from "../components/ChartBox";

export default function Dashboard() {
  const [data, setData] = useState([]);


  useEffect(() => {
    API.get("/reports")
      .then((res) => setData(res.data))
      .catch(() => {});
  }, []);

  // Summary counts
  const pending = data.find(d => d.status === "pending")?.total || 0;
  const inProgress = data.find(d => d.status === "in-progress")?.total || 0;
  const completed = data.find(d => d.status === "completed")?.total || 0;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h1>Dashboard</h1>
        <div style={styles.cards}>
          <div style={styles.card}>
            <h3>Pending</h3>
            <p>{pending}</p>
          </div>
          <div style={styles.card}>
            <h3>In Progress</h3>
            <p>{inProgress}</p>
          </div>
          <div style={styles.card}>
            <h3>Completed</h3>
            <p>{completed}</p>
          </div>
        </div>

        <div style={{marginTop:"30px"}}>
          <h2>Delegation Status Chart</h2>
          <ChartBox data={data}/>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px" },
  cards: { display: "flex", gap: "20px", marginTop: "20px" },
  card: {
    flex: 1,
    padding: "20px",
    borderRadius: "10px",
    background: "#f3f4f6",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
  }
};