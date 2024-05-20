import { Injectable, inject } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { User } from './user';
import { Pub } from './pub';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8000/users/';
  private profileUrl = 'http://localhost:8000/profiles/';
  private loginUrl = 'http://localhost:8000/api-token-auth/';
  //headerDict: HeadersInit | undefined;

  constructor(private http: HttpClient){

  }

  createUser(user: User): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<User>(this.userUrl, user, { headers });
  }

  updateUser(user: User): Observable<User> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
    return this.http.put<User>(`${this.userUrl}current/`, user, { headers, withCredentials: true });
  }

  getCurrentUser(): Observable<User> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
    return this.http.get<User>(`${this.userUrl}current/`, { headers, withCredentials: true });
      }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.loginUrl}`, { username, password }, { headers })
      .pipe(map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          //sessionStorage.setItem('token', response.token);
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isOwner(pub: Pub): Observable<boolean> {
    return this.getCurrentUser().pipe(
      map(user => {
        console.log(user.id); // Logging for verification
        console.log(pub.user); // Logging for verification
        return pub.user == user.id; // Return true if the current user owns the publication
      })
    );
  }

  getUser(username: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<User>(`${this.profileUrl}${username}/`, { headers });
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
