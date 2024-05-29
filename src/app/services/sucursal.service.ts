import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sucursal } from '../models/sucursal';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {
  private apiUrl = 'http://localhost:8000/branches/';

  constructor(private http: HttpClient) { }

  getSucursales(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  public getPhotos(id: number): string {
    return `${this.apiUrl}${id}/photos/`;
  }
  
  createUser(sucursal: Sucursal): Observable<Sucursal> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Sucursal>(this.apiUrl, sucursal, { headers });
  }
}
