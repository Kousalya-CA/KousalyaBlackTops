import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import db from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Returns the greeting stored in SQLite
app.get("/api/message", (req, res) => {
  const row = db.prepare("SELECT text FROM messages ORDER BY id LIMIT 1").get();
  res.json({ message: row.text });
});

// Serve the built React app
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res) => res.sendFile(path.join(clientDist, "index.html")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});