export interface User {
  id: number;
  name: string,
  username: string,
  email: string,
  password: string,
  date: Date,
  mailing?:boolean,
  rating?:number,
  suc: number;
  is_staff?: boolean;
}
