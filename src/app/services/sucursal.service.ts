import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  getSucursal(id: number): Observable<Sucursal> {
    return this.http.get<Sucursal>(`${this.apiUrl}${id}/`);
  }

  public getPhotos(id: number): string {
    return `${this.apiUrl}${id}/photos/`;
  }

}
