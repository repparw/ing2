import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  apiUrl = 'http://localhost:8000/ventas/';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + localStorage.getItem('token'),
    });
  }

  constructor(private http: HttpClient) { }

  cargarVenta(nuevasVentas: Venta[]): Observable<any> {
    return this.http.post(this.apiUrl, nuevasVentas , { headers: this.getHeaders() });
  }

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}
