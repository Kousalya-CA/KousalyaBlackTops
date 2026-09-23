import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(__dirname, "blacktops.db"));

// Create the table and seed the greeting on first run
db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  );
`);

const count = db.prepare("SELECT COUNT(*) AS c FROM messages").get().c;
if (count === 0) {
  db.prepare("INSERT INTO messages (text) VALUES (?)").run("Hello Blacktops");
}

export default db;
