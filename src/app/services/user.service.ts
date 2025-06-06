import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ReplaySubject, Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import { User } from '../models/user';
import { Pub } from '../models/pub';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8000/';
  private userUrl = this.baseUrl + 'users/';
  private profileUrl = this.baseUrl + 'profiles/';
  private loginUrl = this.baseUrl + 'api-token-auth/';
  private getEmailsUrl = this.baseUrl + 'get-all-emails/';
  private resetPasswordUrl = this.baseUrl + 'reset-password/';

  private isAuthenticatedSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject.asObservable();

  private isEmployeeSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public isEmployee$: Observable<boolean> = this.isEmployeeSubject.asObservable();

  private isAdminSubject: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  public isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();

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
          const isEmployee = !!user && user.is_staff === true;
          const isAdmin = !!user && user.is_superuser === true;
          this.isEmployeeSubject.next(isEmployee);
          this.isAdminSubject.next(isAdmin);
        }),
        catchError((error: any) => {
          console.error('Error fetching current user:', error);
          this.isEmployeeSubject.next(false);
          this.isAdminSubject.next(false);
          return throwError(error);
        })
      ).subscribe();
    } else {
      this.isEmployeeSubject.next(false);
      this.isAdminSubject.next(false);
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

  isOwner(pub: Pub): Observable<boolean> {
    return this.getCurrentUser().pipe(
      take(1),
      map(user => user.id === pub.user) // Return true if the current user owns the publication
    );
  }

  isOwner1(pub: Pub): Observable<boolean> {
    return this.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (!pub.user) {
          console.error('La publicación no tiene un usuario asociado.');
          return false;
        }
        return user.id === pub.user;
      })
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

  updateUserById(userId: number, user: User): Observable<User> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('No token found');
    }
  
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });
  
    return this.http.put<User>(`${this.userUrl}${userId}/`, user, { headers, withCredentials: true });
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
    return this.http.put<User>(`${this.userUrl}change-password/`, { old_password: oldPassword, new_password: newPassword, new_password2: newPassword2 }, { headers, withCredentials: true });
  }

  requestPasswordReset(email: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.resetPasswordUrl}`, { email }, { headers });
  }

  resetPassword(uidb64: string, token: string, password: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.resetPasswordUrl}${uidb64}/${token}/`, { password }, { headers });
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

  getAllEmails(): Observable<string[]> {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      return throwError(new Error('No token found'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${authToken}`
    });

    return this.http.get<{ emails: string[] }>(`${this.getEmailsUrl}`, { headers, withCredentials: true }).pipe(
      map(response => response.emails),
      catchError(this.handleError)
    );
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
