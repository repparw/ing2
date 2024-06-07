import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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

  private handleError(error: any) {
    console.error('An error occurred', error);
    return throwError('Something bad happened; please try again later.');
  }

  public createTradeProposal(proposal: TradeProposal): Observable<TradeProposal> {
    return this.http.post<TradeProposal>(`${this.apiUrl}`, proposal, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getTradeProposals(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getTradeProposalsBySucursal(sucursal: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}by-sucursal?sucursal=${sucursal}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getTradeProposal(id: number): Observable<TradeProposal> {
    return this.http.get<TradeProposal>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  public deleteTradeProposal(id: number) {
    return this.http.delete<TradeProposal>(`${this.apiUrl}${id}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  public updateTrade(id: number, trade: Partial<TradeProposal>): Observable<TradeProposal> {
    return this.http.patch<TradeProposal>(`${this.apiUrl}${id}/`, trade, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

}
