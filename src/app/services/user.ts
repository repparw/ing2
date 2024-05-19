export interface User {
  name: string,
  username: string,
  email: string,
  password: string,
  date: Date,
  mailing?:boolean,
  rating?:number,
  suc: number;
  is_employee?: boolean;
}