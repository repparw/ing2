import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Comment } from '../models/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private baseUrl = 'http://localhost:8000/comments/';

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + localStorage.getItem('token'),
    });
  }

  constructor(private http: HttpClient) { }

  createComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(this.baseUrl, comment, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getComments(pubId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}comments-by-pub/${pubId}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${commentId}/`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  replyToComment(commentId: number, responseText: string): Observable<Comment> {
    return this.http.patch<Comment>(`${this.baseUrl}${commentId}/`, { respuesta: responseText }, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Se ha producido un error:', error.error.message);
    } else {
      console.error(`Backend retornó el error ${error.status}, ` + `Cuerpo del error: ${error.error}`);
    }
    return throwError(() => new Error('Por favor, inténtelo de nuevo más tarde.'));
  }
}
