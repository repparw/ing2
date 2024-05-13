import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Empleado } from './empleado';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8000/employees/';

  constructor(private http: HttpClient) { }

  createEmployee(employee: Empleado): Observable<Empleado> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Empleado>(this.apiUrl, employee, { headers });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Se ha producido un error:', error.error.message);
    } else {
      console.error(`Backend retornó el error ${error.status}, ` + `Cuerpo del error: ${error.error}`);
    }
    return throwError(() => new Error('Por favor, inténtelo de nuevo más tarde.'));
  }

  get employee(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl);
      }
}

