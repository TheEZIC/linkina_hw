type UserRole = "requester" | "manager" | "modeler";

type BaseUser = {
  id: number;
  role: UserRole;
  name: string;
}

type User = {
  username: string,
  password: string,
} & BaseUser

type ContactInfo = {
  id: number,
  address?: string,
  phone?: string,
  email?: string,
}

type OrderState = "unresponded" | "assigned" | "responded" | "finished";

type Order = {
  id: number,
  state: OrderState,
  requester_id: number,
  modeler_id?: number,
  name: string,
  specification: string,
  private_description: string,
  deadline: string,
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
