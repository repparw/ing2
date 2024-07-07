// mercado-pago.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private baseUrl = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) { }

  generatePreference(preferenceData: any): Observable<any> {
    const url = `${this.baseUrl}checkout/`;
    console.log(preferenceData);
    return this.http.post<any>(url, preferenceData);
  }

  // Puedes agregar más métodos según las necesidades de tu integración con Mercado Pago
}
