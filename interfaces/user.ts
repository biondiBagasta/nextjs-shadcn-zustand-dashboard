export interface User {
  id: number;
  username: string;
  password: string;
  full_name: string;
  address: string
  phone_number: string
  role: string
  active: number
  created_at: Date;
  updated_at: Date
}