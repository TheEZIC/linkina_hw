import { Database, open } from "sqlite";
// @ts-ignore
import sqlite3 from "sqlite3";
import {ObjectKeys} from "../types";

let database: Database;

const CREATE_QUERY = `
CREATE TABLE IF NOT EXISTS users (
  id integer PRIMARY KEY AUTOINCREMENT,
  role integer NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_info (
  id int PRIMARY KEY,
  address text,
  phone text,
  email text
);

CREATE TABLE IF NOT EXISTS orders (
  id int PRIMARY KEY AUTOINCREMENT,
  state text NOT NULL,
  requester_id int NOT NULL,
  modeler_id int,
  name text NOT NULL,
  specification text NOT NULL,
  private_description text,
  deadline date
);

CREATE TABLE IF NOT EXISTS edits (
  id int PRIMARY KEY AUTOINCREMENT,
  order_id int NOT NULL,
  date date NOT NULL,
  specification text NOT NULL
);

CREATE TABLE IF NOT EXISTS submissions (
  id int PRIMARY KEY AUTOINCREMENT,
  order_id int NOT NULL,
  date date NOT NULL,
  demo_file text NOT NULL
);
`;

export default {
  initDatabase() {
    return open({
      filename: './db.sqlite',
      driver: sqlite3.Database,
    }).then(_ => {
      database = _;
      database.exec(CREATE_QUERY);
    });
  },
  login(username: string, password: string): Promise<Pick<User, 'id' | 'role' | 'name'> | undefined> {
    return database.get(`SELECT id, role, name FROM users WHERE username = ? AND password = ?`, [username, password]);
  },
  register(username: string, password: string, name: string): Promise<void> {
    return database.exec(`INSERT INTO users (role, username, password, name) VALUES (0, ?, ?, ?)`, [username, password, name]);
  },
  getContactInfo(id: number): Promise<ContactInfo> {
    return database.get(`SELECT * FROM contact_info WHERE id = ?`, [id]) as any;
  },
  async updateContactInfo(id: number, update: Partial<Omit<ContactInfo, 'id'>>) {
    let keys = Object.keys(update) as ObjectKeys<Partial<Omit<ContactInfo, "id">>>;
    let info = await database.get(`SELECT * FROM contact_info WHERE id = ?`, [id]) as ContactInfo;

    if(!info) {
      return database.run(`INSERT INTO contact_info (id, ${keys.join(', ')})`, [id, ...keys.map(v => update[v])]);
    } else {
      let params = [...keys.map((v) => update[v]), id];

      return database.run(`UPDATE contact_info SET ${keys.map(v => `${v} = ?`).join(', ')} WHERE id = ?`, params);
    }
  },

  manager: {
    findOrders(params: Partial<Pick<Order, 'requester_id' | 'modeler_id' | 'state'>>): Promise<Order[]> {
      let keys = Object.keys(params);
      return database.all(`SELECT * FROM orders WHERE ${keys.map(v => `${v} = ?`).join(' AND ')}`, keys.map(v => (params as any)[v]))
    },
    assignOrder(id: number, modeler_id: number, deadline: Date) {
      return database.exec(`UPDATE orders SET modeler_id = ?, deadline = ? WHERE id = ?`, [modeler_id, deadline.valueOf(), id]);
    },
    updatePrivateDescription(id: number, description: string) {
      return database.exec(`UPDATE orders SET private_description = ? WHERE id = ?`, [description, id]);
    },
  },
  requester: {
    submitOrder(requester_id: number, request: Pick<Order, 'name' | 'specification'>) {
      return database.exec(`INSERT INTO orders (state, requester_id, name, specification) VALUES (?, ?, ?, ?)`, ["unresponded", requester_id, request.name, request.specification]);
    },
    getOrders(requester_id: number): Promise<Omit<Order, 'requester_id' | 'private_description'>[]> {
      return database.all(`SELECT id, state, modeler_id, name, specification FROM orders WHERE requester_id = ?`, [requester_id]) as any;
    },
    async getSubmissions(requester_id: number, order_id: number): Promise<Submission[]> {
      let order = await database.get(`SELECT requester_id FROM orders WHERE id = ?`, [order_id]);
      if(order.requester_id != requester_id)
        throw "bruh";

      return database.all(`SELECT * FROM submissions WHERE order_id = ?`, [order_id])
    },
    async submitEdit(requester_id: number, order_id: number, specification: string) {
      let order = await database.get(`SELECT requester_id FROM orders WHERE id = ?`, [order_id]);
      if(order.requester_id != requester_id)
        throw "bruh";

      return database.exec(`INSERT INTO edits (order_id, date, specification) VALUES (?, ?, ?)`, [order_id, Date.now(), specification]);
    }
  },
  modeler: {
    getOrders(modeler_id: number): Promise<Order[]> {
      return database.all(`SELECT * FROM orders WHERE modeler_id = ?`, [modeler_id]);
    },
    getEdits(order_id: number): Promise<Edit[]> {
      return database.all(`SELECT * FROM edits WHERE order_id = ?`, [order_id]);
    },
    addSubmission(order_id: number, file: string) {
      return database.exec(`INSERT INTO submissions (order_id, date, demo_file) VALUES (?, ?, ?)`, [order_id, Date.now(), file]);
    }
  }
}
