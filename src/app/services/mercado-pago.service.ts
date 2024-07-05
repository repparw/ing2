// mercado-pago.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private publicKey = 'TU_PUBLIC_KEY'; // Reemplaza con tu PUBLIC_KEY de Mercado Pago
  private apiUrl = 'https://api.mercadopago.com';

  constructor(private http: HttpClient) { }

  generatePreference(preferenceData: any): Observable<any> {
    const url = `${this.apiUrl}/checkout/preferences?access_token=${this.publicKey}`;
    return this.http.post<any>(url, preferenceData);
  }

  // Puedes agregar más métodos según las necesidades de tu integración con Mercado Pago
}
