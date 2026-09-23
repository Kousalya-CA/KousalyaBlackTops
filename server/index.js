import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Returns the greeting stored in SQLite
app.get("/api/message", (req, res) => {
  const row = db.prepare("SELECT text FROM messages ORDER BY id LIMIT 1").get();
  res.json({ message: row.text });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
