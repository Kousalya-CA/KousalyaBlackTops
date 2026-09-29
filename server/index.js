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

// Session storage (in-memory for simplicity)
const sessions = new Map();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");
  const session = sessionId ? sessions.get(sessionId) : null;

  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = session.user;
  next();
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }
  next();
};

// Login endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  const user = db.prepare("SELECT id, username, isAdmin FROM users WHERE username = ? AND password = ?")
    .get(username, password);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // Create session
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  sessions.set(sessionId, {
    user: {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin === 1
    }
  });

  res.json({
    sessionId,
    user: {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin === 1
    }
  });
});

// Logout endpoint
app.post("/api/logout", isAuthenticated, (req, res) => {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");
  if (sessionId) {
    sessions.delete(sessionId);
  }
  res.json({ message: "Logged out successfully" });
});

// Check current session
app.get("/api/session", (req, res) => {
  const sessionId = req.headers.authorization?.replace("Bearer ", "");
  const session = sessionId ? sessions.get(sessionId) : null;

  if (!session) {
    return res.status(401).json({ error: "No active session" });
  }

  res.json({ user: session.user });
});

// Returns the greeting stored in SQLite
app.get("/api/message", (req, res) => {
  const row = db.prepare("SELECT text FROM messages ORDER BY id LIMIT 1").get();
  res.json({ message: row.text });
});

// Admin-only endpoint to update the greeting
app.post("/api/admin/message", isAuthenticated, isAdmin, (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const row = db.prepare("SELECT id FROM messages ORDER BY id LIMIT 1").get();
  if (row) {
    db.prepare("UPDATE messages SET text = ? WHERE id = ?").run(message, row.id);
  } else {
    db.prepare("INSERT INTO messages (text) VALUES (?)").run(message);
  }

  res.json({ message: "Message updated successfully" });
});

// Admin-only endpoint to get all users
app.get("/api/admin/users", isAuthenticated, isAdmin, (req, res) => {
  const users = db.prepare("SELECT id, username, isAdmin, createdAt FROM users").all();
  res.json({ users: users.map(u => ({ ...u, isAdmin: u.isAdmin === 1 })) });
});

// Serve the built React app
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (req, res) => res.sendFile(path.join(clientDist, "index.html")));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});