import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SucursalRating } from '../models/sucursalRating'; 

@Injectable({
  providedIn: 'root'
})
export class SucursalRatingService {
  private apiUrl = 'http://localhost:8000/sucursal-ratings/';  // Adjust URL as per your Django API endpoint

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + localStorage.getItem('token'),
    });
  }

  getRatingsBySucursalId(sucursalId: number): Observable<SucursalRating[]> {
    const url = `${this.apiUrl}by-sucursal?sucursal=${sucursalId}`;
    return this.http.get<SucursalRating[]>(url, { headers: this.getHeaders() });
  }
  addRating(rating: SucursalRating): Observable<SucursalRating> {
    return this.http.post<SucursalRating>(this.apiUrl, rating, { headers: this.getHeaders() });
  }
}  