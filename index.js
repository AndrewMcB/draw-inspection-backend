require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware (Add this if missing)
app.use(express.json()); // Allows backend to read JSON requests
app.use(cors()); // Allow frontend requests

// Connect to PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// **Fix: Add Create Project API Route**
app.post("/create-project", async (req, res) => {
  const { builder_name, project_name, foundation_type } = req.body;

  if (!builder_name || !project_name || !foundation_type) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO projects (builder_name, project_name, foundation_type) VALUES ($1, $2, $3) RETURNING *",
      [builder_name, project_name, foundation_type]
    );

    res.json({ message: "Project created successfully!", project: result.rows[0] });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
