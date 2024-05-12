import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Pub } from './pub';

@Injectable({
  providedIn: 'root'
})

export class PublicationService {
  private apiUrl = 'http://localhost:8000/publications/';

  constructor(private http: HttpClient) { }

  createPublication(publication: Pub): Observable<Pub> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<Pub>(this.apiUrl, publication, { headers });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Se ha producido un error:', error.error.message);
    } else {
      console.error(`Backend retornó el error ${error.status}, ` + `Cuerpo del error: ${error.error}`);
    }
    return throwError(() => new Error('Por favor, inténtelo de nuevo más tarde.'));
  }

  get publication(): Observable<Pub[]> {
    return this.http.get<Pub[]>(this.apiUrl);
      }
}

