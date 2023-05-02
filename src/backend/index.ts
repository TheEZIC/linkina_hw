import bsqlite3 from "better-sqlite3";

type ObjectKeys<T extends object> = (keyof T)[];

let database: bsqlite3.Database;

const CREATE_QUERY = `
CREATE TABLE IF NOT EXISTS users (
  id integer PRIMARY KEY AUTOINCREMENT,
  role text NOT NULL,
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

const backend = {
  initDatabase() {
    database = bsqlite3('./db.sqlite');
    database.exec(CREATE_QUERY);
  },
  login(username: string, password: string): Promise<BaseUser | undefined> {
    return database.prepare(`SELECT id, role, name FROM users WHERE username = ? AND password = ?`).get(username, password) as any;
  },
  register(username: string, password: string, name: string): Promise<BaseUser> {
    database.prepare(`INSERT INTO users (role, username, password, name) VALUES ('requester', ?, ?, ?)`).run(username, password, name);
    console.log(backend, "backend");
    return backend.login(username, password);
  },
  getContactInfo(id: number): Promise<ContactInfo> {
    return database.prepare(`SELECT * FROM contact_info WHERE id = ?`).get(id) as any;
  },
  async updateContactInfo(id: number, update: Partial<Omit<ContactInfo, 'id'>>): Promise<void> {
    let keys = Object.keys(update) as ObjectKeys<Partial<Omit<ContactInfo, "id">>>;
    let info = await this.getContactInfo(id);

    if(!info) {
      return database.prepare(`INSERT INTO contact_info (id, ${keys.join(', ')})`).run(id, ...keys.map(v => update[v])) as any;
    } else {
      return database.prepare(`UPDATE contact_info SET ${keys.map(v => `${v} = ?`).join(', ')} WHERE id = ?`).run(...keys.map((v) => update[v]), id) as any;
    }
  },
  manager: {
    findOrders(params?: Partial<Pick<Order, 'requester_id' | 'modeler_id' | 'state'>>): Promise<Order[]> {
      if (params) {
        let keys = Object.keys(params);
        return database.prepare(`SELECT * FROM orders WHERE ${keys.map(v => `${v} = ?`).join(' AND ')}`).all(...keys.map(v => (params as any)[v])) as any;
      } else {
        return database.prepare(`SELECT * FROM orders`).all() as any;
      }
    },
    assignOrder(id: number, modeler_id?: number, deadline?: Date): Promise<void> {
      let state = modeler_id ? "assigned" : "unassigned";
      return database.prepare(`UPDATE orders SET modeler_id = ?, deadline = ?, state = ? WHERE id = ?`).run(modeler_id, deadline.valueOf(), state, id) as any;
    },
    updatePrivateDescription(id: number, description: string): Promise<void> {
      return database.prepare(`UPDATE orders SET private_description = ? WHERE id = ?`).run(description, id) as any;
    },
    getModelers(): Promise<Pick<User, 'id' | 'name'>[]> {
      return database.prepare(`SELECT id, name FROM users WHERE role = ?`).all('modeler') as any;
    },
    getRequesters(): Promise<Pick<User, 'id' | 'name'>> {
      return database.prepare(`SELECT id, name FROM users WHERE role = ?`).all('requester') as any;
    }
  },
  requester: {
    submitOrder(requester_id: number, order: Pick<Order, 'name' | 'specification'>) {
      return database.prepare(`INSERT INTO orders (state, requester_id, name, specification) VALUES (?, ?, ?, ?)`).run("unassigned", requester_id, order.name, order.specification);
    },
    editOrder(requester_id: number, order_id: number, data: Pick<Order, 'name' | 'specification'>): Promise<void> {
      let order = database.prepare(`SELECT requester_id FROM orders WHERE id = ?`).get(order_id) as Pick<Order, 'requester_id'>;
      if(order.requester_id != requester_id)
        throw "bruh";

      return database.prepare(`UPDATE orders SET name = ?, specification = ? WHERE id = ?`).run(data.name, data.specification, order_id) as any;
    },
    deleteOrder(requester_id: number, order_id: number): Promise<void> {
      let order = database.prepare(`SELECT requester_id FROM orders WHERE id = ?`).get(order_id) as Pick<Order, 'requester_id'>;
      if(order.requester_id != requester_id)
        throw "bruh";

      database.prepare(`DELETE FROM edits WHERE order_id = ?`).run(order_id);
      database.prepare(`DELETE FROM submissions WHERE order_id = ?`).run(order_id); // ?
      return database.prepare(`DELETE FROM orders WHERE id = ?`).run(order_id) as any;
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
    async submitEdit(requester_id: number, order_id: number, specification: string): Promise<void> {
      let order = database.prepare(`SELECT requester_id FROM orders WHERE id = ?`).get(order_id) as Pick<Order, 'requester_id'>;
      if(order.requester_id != requester_id)
        throw "bruh";

      database.prepare(`UPDATE orders SET state = ? WHERE id = ?`).run("assigned", order_id);

      return database.prepare(`INSERT INTO edits (order_id, date, specification) VALUES (?, ?, ?)`).run(order_id, Date.now(), specification) as any;
    },
    finishOrder(requester_id: number, order_id: number): Promise<void> {
      let order = database.prepare(`SELECT requester_id FROM orders WHERE id = ?`).get(order_id) as Pick<Order, 'requester_id'>;
      if(order?.requester_id != requester_id)
        throw "bruh";

      return database.prepare(`UPDATE orders SET state = ? WHERE id = ?`).run("finished", order_id) as any;
    }
  },
  modeler: {
    getOrders(modeler_id: number): Promise<Order[]> {
      return database.prepare(`SELECT * FROM orders WHERE modeler_id = ? AND state <> ?`).all(modeler_id, "finished") as any;
    },
    getEdits(order_id: number): Promise<Edit[]> {
      return database.prepare(`SELECT * FROM edits WHERE order_id = ?`).all(order_id) as any;
    },
    addSubmission(order_id: number, file: string): Promise<void> {
      database.prepare(`UPDATE orders SET state = ? WHERE id = ?`).run("responded", order_id);
      return database.prepare(`INSERT INTO submissions (order_id, date, demo_file) VALUES (?, ?, ?)`).run(order_id, Date.now(), file) as any;
    }
  }
}

export default backend;
