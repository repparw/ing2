import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map,switchMap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CodigoDescuentoService {
  private apiUrl = 'assets/discount-codes.json';

  constructor(private http: HttpClient) { }

  getDiscountCodes(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  saveDiscountCode(code: any): Observable<any> {
    return this.getDiscountCodes().pipe(
      map((codes: any) => {
        codes.push(code);
        return codes;
      }),
      switchMap((updatedCodes: any[]) => this.http.put(this.apiUrl, updatedCodes))
    );
  }
}

