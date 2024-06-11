import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  apiUrl = 'http://localhost:8000/statistics/';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + localStorage.getItem('token'),
    });
  }

  constructor(private http: HttpClient) { }

  getStatistics(sucursalId?: string): Observable<any> {
    if (sucursalId) {
      return this.http.get<any>(`${this.apiUrl}sucursal/${sucursalId}/`, { headers: this.getHeaders() });
    }
    return this.http.get<any>(this.apiUrl, { headers: this.getHeaders() });
  }

}
