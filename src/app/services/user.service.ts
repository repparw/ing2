import { Injectable, inject } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { User } from './user';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8000/users/';
  private loginUrl = 'http://localhost:8000/login/';
  //headerDict: HeadersInit | undefined;


  constructor(private http: HttpClient){
    
  }

  createUser(user: User): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<User>(this.userUrl, user, { headers, withCredentials: true });
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.loginUrl}`, { username, password }, { headers, withCredentials: true})
      .pipe(map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          //sessionStorage.setItem('token', response.token);
        }
        return response;
      }));
  }

  authorizeUser(username: string, password: string, csrfmiddlewaretoken: string): Observable<any>{
    const encodedBody = new URLSearchParams();
    encodedBody.set('username', username);
    encodedBody.set('password', password);
    encodedBody.set('csrfmiddlewaretoken', csrfmiddlewaretoken)
  
    return this.http.post(this.loginUrl, encodedBody);
  
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  get user(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
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
