import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Venta } from '../models/venta';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  apiUrl = 'http://localhost:8000/ventas/';

  constructor(private http: HttpClient) { }

  cargarVenta(nuevaVenta: Venta): Observable<any> {
    return this.http.post(this.apiUrl, nuevaVenta);
  }

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }
}