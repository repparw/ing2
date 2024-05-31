import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CodigoDescuentoService {
  private apiUrl = 'http://localhost:8000/save-discount-codes/'; // URL de la API en Django
  private apiUrl2= 'http://localhost:8000/verificar-codigo/';
  private apiUrl3= 'http://localhost:8000/borrar-codigo/';

  constructor(private http: HttpClient) { }

  generateDiscountCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Método para obtener los códigos de descuento desde el backend
  getDiscountCodes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Método para guardar un nuevo código de descuento con su descripción en el backend
  saveDiscountCode(code:string, description: string, discount: string): Observable<any> {
    description+=' '+discount+'%' ;
    return this.http.post(this.apiUrl, { code,  description});
  }

  verificarCodigo(codigo: string): Observable<any> {
    return this.http.post<any>(this.apiUrl2, { codigo });
  }

  borrarCodigo(codigo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl3}${codigo}`);
  }
}
