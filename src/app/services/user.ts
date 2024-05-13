export interface User {
  name: string,
  dni: number,
  email: string,
  password?: string,
  date: Date,
  mailing:boolean,
  valoracion: number,
  suc: number;
}