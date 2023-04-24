type User = {
  id: number,
  role: number,
  username: string,
  password: string,
  name: string,
  contact_info_id?: number,
}

type ContactInfo = {
  id: number,
  address?: string,
  phone?: string,
  email?: string,
}