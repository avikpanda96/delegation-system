const app = require("./app");
// Root route (to test Render URL)
app.get("/", (req, res) => {
  res.send("Backend is live ✅");
});

// Test DB connection route
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ success: true, result: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(5000, () => {
  console.log("Server running");
});
