import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, "blacktops.db"));

const GREETING = "Hi Blacktops";

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  );
`);

// Insert the greeting, or update it if it already exists
const row = db.prepare("SELECT id FROM messages ORDER BY id LIMIT 1").get();
if (row) {
  db.prepare("UPDATE messages SET text = ? WHERE id = ?").run(GREETING, row.id);
} else {
  db.prepare("INSERT INTO messages (text) VALUES (?)").run(GREETING);
}

// Users table for authentication and admin access
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    isAdmin  INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Insert default admin user if not exists (password: admin123)
const adminUser = db.prepare("SELECT id FROM users WHERE username = ?").get("admin");
if (!adminUser) {
  db.prepare("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)").run("admin", "admin123", 1);
}

// Insert default regular user if not exists (password: user123)
const regularUser = db.prepare("SELECT id FROM users WHERE username = ?").get("user");
if (!regularUser) {
  db.prepare("INSERT INTO users (username, password, isAdmin) VALUES (?, ?, ?)").run("user", "user123", 0);
}

export default db;