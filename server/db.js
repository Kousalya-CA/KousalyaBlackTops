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

export default db;