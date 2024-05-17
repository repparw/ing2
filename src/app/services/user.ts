export interface User {
  name: string,
  dni: string,
  email: string,
  password: string,
  date: Date,
  mailing?:boolean,
  rating?:number,
  suc: number;
}