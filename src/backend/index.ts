import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

var database: Database;

export default {
  initDatabase() {
    return open({
      filename: './db.sqlite',
      driver: sqlite3.Database,
    }).then(_ => database = _);
  },

  login(username: string, password: string): Pick<User, 'id' | 'role' | 'name'> {
    return database.get(`SELECT id, role, name FROM users WHERE username = ? AND password = ?`, [username, password]) as any;
  },
  register(username: string, password: string, name: string) {
    return database.exec(`INSERT INTO users (role, username, password, name) VALUES (0, ?, ?, ?)`, [...arguments]);
  },
  async getContactInfo(id: number) {
    let user = await database.get(`SELECT contact_info_id`);
    // 
  },
  async updateContactInfo(id: number, update: Partial<Omit<ContactInfo, 'id'>>) {
    let keys = Object.keys(update);
    let info = await database.get(`SELECT * FROM contact_info WHERE id = ?`, [id]) as ContactInfo;
    if(!info)
      return database.run(`INSERT INTO contact_info (${keys.join(', ')})`, keys.map(v => (update as any)[v]));
    else
      return database.run(`UPDATE contact_info SET ${keys.map(v => `${v} = ?`).join(', ')} WHERE id = ?`, [...keys.map(v => (update as any)[v]), id]);
  },
}