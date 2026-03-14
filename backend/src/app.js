const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const delegationRoutes = require("./routes/delegation.routes");
const reportRoutes = require("./routes/report.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/delegations", delegationRoutes);
app.use("/reports", reportRoutes);

module.exports = app;