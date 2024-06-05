import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TradeProposal } from '../models/tradeProposal';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  private apiUrl = 'http://localhost:8000/proposals/';

  constructor(private http: HttpClient) { }

    // Method to handle HTTP headers with CSRF token
    private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + localStorage.getItem('token'),
      });
    }

  getTradeProposals(token: string): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() } );
  }

  getTradeProposalsBySucursal(sucursal: number): Observable<any[]>{
    return this.http.get<any[]>(`${this.apiUrl}by-sucursal?sucursal=${sucursal}`, { headers: this.getHeaders() });
  }

  getTradeProposal(id: number): Observable<TradeProposal> {
    return this.http.get<TradeProposal>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  public deleteTradeProposal(id: number) {
    return this.http.delete<TradeProposal>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() });
  }

  public updateTrade(id: number, trade: TradeProposal): Observable<TradeProposal> {
    return this.http.put<TradeProposal>(`${this.apiUrl}${id}/`, trade, { headers: this.getHeaders() })
  }

}

