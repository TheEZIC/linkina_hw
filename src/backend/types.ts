type UserRole = "requester" | "manager" | "modeler";

type BaseUser = {
  id: number;
  role: UserRole;
  name: string;
}

type User = {
  username: string,
  password: string,
} & BaseUser;

type ModelerUser = Pick<User, "name" | "id">;

type ContactInfo = {
  id: number,
  address?: string,
  phone?: string,
  email?: string,
}

type OrderState = "unassigned" | "assigned" | "responded" | "finished";

type Order = {
  id: number,
  state: OrderState,
  requester_id: number,
  modeler_id?: number,
  name: string,
  specification: string,
  private_description: string,
  deadline: number,
}

type Edit = {
  id: number,
  order_id: number,
  date: number,
  specification: string,
}

type Submission = {
  id: number,
  order_id: number,
  date: number,
  demo_file: string,
}
