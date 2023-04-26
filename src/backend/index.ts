// import { Database, open } from "sqlite";
// @ts-ignore
import sqlite3 from "sqlite3-prebuilt";
import bsqlite3 from "better-sqlite3";

type ObjectKeys<T extends object> = (keyof T)[];

let database: bsqlite3.Database;

const CREATE_QUERY = `
CREATE TABLE IF NOT EXISTS users (
  id integer PRIMARY KEY AUTOINCREMENT,
  role integer NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  name text NOT NULL
);

CREATE TABLE IF NOT EXISTS contact_info (
  id integer PRIMARY KEY,
  address text,
  phone text,
  email text
);

CREATE TABLE IF NOT EXISTS orders (
  id integer PRIMARY KEY AUTOINCREMENT,
  state text NOT NULL,
  requester_id integer NOT NULL,
  modeler_id integer,
  name text NOT NULL,
  specification text NOT NULL,
  private_description text,
  deadline integer
);

CREATE TABLE IF NOT EXISTS edits (
  id integer PRIMARY KEY AUTOINCREMENT,
  order_id integer NOT NULL,
  date integer NOT NULL,
  specification text NOT NULL
);

CREATE TABLE IF NOT EXISTS submissions (
  id integer PRIMARY KEY AUTOINCREMENT,
  order_id integer NOT NULL,
  date integer NOT NULL,
  demo_file text NOT NULL
);
`;

export default {
  initDatabase() {
    database = bsqlite3('./db.sqlite');
    database.exec(CREATE_QUERY);
    // return open({
    //   filename: './db.sqlite',
    //   driver: sqlite3.Database,
    // }).then(_ => {
    //   database = _;
    //   database.exec(CREATE_QUERY);
    // });
  },
  login(username: string, password: string): Promise<Pick<User, 'id' | 'role' | 'name'> | undefined> {
    return database.prepare(`SELECT id, role, name FROM users WHERE username = ? AND password = ?`).get(username, password) as any;
  },
  register(username: string, password: string, name: string): Promise<void> {
    return database.prepare(`INSERT INTO users (role, username, password, name) VALUES (0, ?, ?, ?)`).run(username, password, name) as any;
  },
  getContactInfo(id: number): Promise<ContactInfo> {
    return database.prepare(`SELECT * FROM contact_info WHERE id = ?`).get(id) as any;
  },
  async updateContactInfo(id: number, update: Partial<Omit<ContactInfo, 'id'>>) {
    let keys = Object.keys(update) as ObjectKeys<Partial<Omit<ContactInfo, "id">>>;
    let info = await this.getContactInfo(id);

    if(!info) {
      return database.prepare(`INSERT INTO contact_info (id, ${keys.join(', ')})`).run(id, ...keys.map(v => update[v]));
    } else {
      return database.prepare(`UPDATE contact_info SET ${keys.map(v => `${v} = ?`).join(', ')} WHERE id = ?`).run(...keys.map((v) => update[v]), id);
    }
  },

  manager: {
    findOrders(params: Partial<Pick<Order, 'requester_id' | 'modeler_id' | 'state'>>): Promise<Order[]> {
      let keys = Object.keys(params);
      return database.prepare(`SELECT * FROM orders WHERE ${keys.map(v => `${v} = ?`).join(' AND ')}`).all(...keys.map(v => (params as any)[v])) as any;
    },
    assignOrder(id: number, modeler_id: number, deadline: Date) {
      return database.prepare(`UPDATE orders SET modeler_id = ?, deadline = ? WHERE id = ?`).run(modeler_id, deadline.valueOf(), id);
    },
    updatePrivateDescription(id: number, description: string) {
      return database.prepare(`UPDATE orders SET private_description = ? WHERE id = ?`).run(description, id);
    },
  },
  requester: {
    submitOrder(requester_id: number, request: Pick<Order, 'name' | 'specification'>) {
      return database.prepare(`INSERT INTO orders (state, requester_id, name, specification) VALUES (?, ?, ?, ?)`).run("unresponded", requester_id, request.name, request.specification);
    },
    getOrders(requester_id: number): Promise<Omit<Order, 'requester_id' | 'private_description'>[]> {
      return database.prepare(`SELECT id, state, modeler_id, name, specification FROM orders WHERE requester_id = ?`).all(requester_id) as any;
    },
    async getSubmissions(requester_id: number, order_id: number): Promise<Submission[]> {
      let order = database.prepare(`SELECT requester_id FROM orders WHERE id = ?`).get(order_id) as Pick<Order, 'requester_id'>;
      if(order.requester_id != requester_id)
        throw "bruh";
      
      return database.prepare(`SELECT * FROM submissions WHERE order_id = ?`).all(order_id) as any;
    },
    async submitEdit(requester_id: number, order_id: number, specification: string) {
      let order = database.prepare(`SELECT requester_id FROM orders WHERE id = ?`).get(order_id) as Pick<Order, 'requester_id'>;
      if(order.requester_id != requester_id)
        throw "bruh";

      return database.prepare(`INSERT INTO edits (order_id, date, specification) VALUES (?, ?, ?)`).run(order_id, Date.now(), specification);
    }
  },
  modeler: {
    getOrders(modeler_id: number): Promise<Order[]> {
      return database.prepare(`SELECT * FROM orders WHERE modeler_id = ?`).all(modeler_id) as any;
    },
    getEdits(order_id: number): Promise<Edit[]> {
      return database.prepare(`SELECT * FROM edits WHERE order_id = ?`).all(order_id) as any;
    },
    addSubmission(order_id: number, file: string) {
      return database.prepare(`INSERT INTO submissions (order_id, date, demo_file) VALUES (?, ?, ?)`).run(order_id, Date.now(), file);
    }
  }
}
