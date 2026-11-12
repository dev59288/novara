
"use strict";

const express = require("express");
const helmet = require("helmet");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

app.disable("x-powered-by");

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(express.json({ limit: "1mb" }));

// Serve NOVARA frontend
app.use(express.static(PUBLIC_DIR));

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    name: "NOVARA",
    status: "running"
  });
});

// API fallback
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

// Home page
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`NOVARA running on port ${PORT}`);
});
