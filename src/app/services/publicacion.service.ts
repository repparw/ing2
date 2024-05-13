import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Pub } from './pub';

@Injectable({
  providedIn: 'root'
})

export class PublicationService {
  private baseUrl = 'http://localhost:8000/';
  private apiUrl = this.baseUrl + 'publications/';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Se ha producido un error:', error.error.message);
    } else {
      console.error(`Backend retornó el error ${error.status}, ` + `Cuerpo del error: ${error.error}`);
    }
    return throwError(() => new Error('Por favor, inténtelo de nuevo más tarde.'));
  }

  public getPublication(id: number): Observable<Pub> {
    return this.http.get<Pub>(this.apiUrl + id + '/');
      }

  public getAllCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'categories/');
      }

  public getPublications(): Observable<Pub[]> {
    return this.http.get<Pub[]>(this.apiUrl);
      }

  public updatePublication(id: number, pub: Pub): Observable<Pub> {
    return this.http.put<Pub>(this.apiUrl + id + '/', pub);
      }

  public deletePublication(id: number): Observable<Pub> {
    return this.http.delete<Pub>(this.apiUrl + id + '/');
      }
}

