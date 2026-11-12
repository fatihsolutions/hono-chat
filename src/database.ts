import { DatabaseSync } from "node:sqlite";
export const db = new DatabaseSync('./src/tmp/database.db')

db.exec(`
    CREATE TABLE IF NOT EXISTS messages(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT NOT NULL,
    receiver TEXT NOT NULL, 
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    `);

const messages = db.prepare(`
    SELECT * FROM messages
    WHERE (sender = 'fatih' AND receiver = 'sarah')
       OR (sender = 'sarah' AND receiver = 'fatih')
    ORDER BY created_at ASC, id ASC
`).all();

console.log('Fatih og Sarah beskeder:', messages);
