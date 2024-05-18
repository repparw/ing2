import { Injectable, inject } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8000/users/';
  headerDict: HeadersInit | undefined;


  constructor(private http: HttpClient){
    
  }

  createUser(user: User): Observable<User> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<User>(this.userUrl, user, {headers});
  }

  login (formValue: any){
    return firstValueFrom(
      this.http.post<any>(`${this.userUrl}/login`, formValue)
    );
  }

  get employee(): Observable<User[]> {
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

  
  /*login(): void {
    let credentials: SigafCredentials = {
      username: this.username,
      password: this.password,
      }
      this.loginErrorMessage = "";
      this.sigafService.login(credentials)
      .subscribe(user => { this.isLoggedIn = (user != null) }, err => {
          this.loginErrorMessage = err.message;
      });
  }
    
  logout(): void {
      this.sigafService.logout();
      this.isLoggedIn = false;
  }*/

  /*login(){
    let credentials: LoginRequest{
      email: this.email,
      password: this.password,
    }
    
  }*/

}
