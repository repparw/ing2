import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { User } from './user';
import { Pub } from './pub';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8000/users/';
  private profileUrl = 'http://localhost:8000/profiles/';
  private loginUrl = 'http://localhost:8000/api-token-auth/';

  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private isEmployeeSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public isEmployee$: Observable<boolean> = this.isEmployeeSubject.asObservable();

  constructor(private http: HttpClient) {
    this.updateAuthStatus(); // Initialize authentication status
  }

  private updateAuthStatus(): void {
    const isAuthenticated = this.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);

    if (isAuthenticated) {
      this.getCurrentUser().pipe(
        take(1),
        map(user => {
          const isEmployee = !!user && user.is_employee === true;
          this.isEmployeeSubject.next(isEmployee);
        }),
        catchError(() => {
          this.isEmployeeSubject.next(false);
          return throwError(false); // Return false if getCurrentUser() fails
        })
      ).subscribe();
    } else {
      this.isEmployeeSubject.next(false);
    }
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.loginUrl}`, { username, password }, { headers })
      .pipe(map(response => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.updateAuthStatus(); // Update isAuthenticated status on successful login
        }
        return response;
      }));
  }

  logout(): void {
    localStorage.removeItem('token');
    this.updateAuthStatus(); // Update isAuthenticated status on logout
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  isEmployee(): boolean {
    return this.isEmployeeSubject.getValue();
  }

  isOwner(pub: Pub): Observable<boolean> {
    return this.getCurrentUser().pipe(
      take(1),
      map(user => user.id === pub.user) // Return true if the current user owns the publication
    );
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

  changePassword(oldPassword: string, newPassword: string, newPassword2: string): Observable<User> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      return throwError(new Error('No token found'));
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
    return this.http.put<User>(`${this.userUrl}change-password/`, {old_password: oldPassword, new_password: newPassword, new_password2: newPassword2 }, { headers, withCredentials: true });
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
    return this.http.get<User>(`${this.userUrl}current/`, { headers, withCredentials: true }).pipe(
      catchError(error => {
        console.error('Error fetching current user:', error);
        return throwError(error); // Forward the error to the caller
      }));
      }


  getUserByUsername(username: string): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<User>(`${this.profileUrl}${username}/`, { headers });
  }

  getUser(id: number): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get<User>(`${this.userUrl}${id}/`, { headers });
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
