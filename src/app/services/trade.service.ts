import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  private apiUrl = 'http://localhost:8000/proposals/';

  constructor(private http: HttpClient) { }

  getTradeProposals(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<any[]>(this.apiUrl);
  }
}

