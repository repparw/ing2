export interface User {
  id: number;
  email: string;
  dni: string;
  password?: string;
  fechaNacimiento?: Date;
  nombre: string;
  apellido: string;

}