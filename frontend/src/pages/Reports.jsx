
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Reports() {
  const { user } = useAuth();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user) return;

    API.get("/reports")
      .then((res) => {
        // transform API data for Recharts
        const chartData = res.data.map((item) => ({
          name: item.status,
          value: item.total,
        }));
        setData(chartData);
      })
      .catch((err) => console.error(err));
  }, [user]);

  const COLORS = ["#4f46e5", "#10b981", "#facc15", "#f87171"];

  return (
    <div>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <h1>Reports</h1>

        {data.length === 0 ? (
          <p style={{ marginTop: "20px" }}>
            No report data available. {user && user.role === "user" ? "Check your assigned delegations." : ""}
          </p>
        ) : (
          <div style={{ marginTop: "20px", width: "100%", height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Optional: Text summary */}
        {data.length > 0 && (
          <div style={{ marginTop: "30px" }}>
            {data.map((item) => (
              <p key={item.name}>
                <strong>{item.name}:</strong> {item.value}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}