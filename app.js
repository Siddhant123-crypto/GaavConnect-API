const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const sarpanchRoutes = require("./routes/sarpanchRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/sarpanch", sarpanchRoutes);

module.exports = app;