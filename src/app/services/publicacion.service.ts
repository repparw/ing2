import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Pub } from './pub';

@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  private baseUrl = 'http://127.0.0.1:8000/';
  private apiUrl = this.baseUrl + 'publications/';
  private byUserUrl = this.baseUrl + 'publications-by/';

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Se ha producido un error:', error.error.message);
    } else {
      console.error(`Backend retornó el error ${error.status}, ` + `Cuerpo del error: ${error.error}`);
    }
    return throwError(() => new Error('Por favor, inténtelo de nuevo más tarde.'));
  }

  public createPublication(pub: Pub): Observable<Pub> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
    return this.http.post<Pub>(this.apiUrl, pub, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  public getPublication(id: number): Observable<Pub> {
    return this.http.get<Pub>(this.apiUrl + id + '/', { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  public getPublicationsById(id: number): Observable<Pub[]> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
    return this.http.get<Pub[]>(this.byUserUrl + id, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
      }

  public getPhotos(id: number): string {
    return `${this.apiUrl}${id}/photos/`;
  }

  public getAllCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'categories/', { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  public getPublications(): Observable<Pub[]> {
    return this.http.get<Pub[]>(this.apiUrl, { withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  public updatePublication(id: number, pub: Partial<Pub>): Observable<Pub> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
    return this.http.patch<Pub>(this.apiUrl + id + '/', pub, { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }

  public deletePublication(id: number): Observable<Pub> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
    return this.http.delete<Pub>(this.apiUrl + id + '/', { headers, withCredentials: true })
      .pipe(catchError(this.handleError));
  }
}
