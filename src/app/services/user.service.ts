import { Injectable, inject } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, firstValueFrom, tap, throwError } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /*currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<User> = new BehaviorSubject<User>({ name: '', dni: 0, email:'', password: '', date: new Date(), mailing: false, valoracion: 0, suc: 0});

  private userUrl = 'http://localhost:8000/users/'; 
  headerDict: HeadersInit | undefined;

  constructor(private http: HttpClient) { }

  
  
  //return this.http.get(this.heroesUrl, requestOptions)

  login(credential:LoginRequest): Observable<User>{
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<User>(this.userUrl, {headers}).pipe(
      tap((userData: User) => {
        this.currentUserData.next(userData);
        this.currentUserLoginOn.next(true);
      }),
      catchError(this.handleError)
    );

  }

  private handleError (error:HttpErrorResponse ){
    if (error.status === 0){
      console.error('se ha producido un error', error.error);
    }
    else{
      console.error('Backend retorno el error', error.status, error.error);
    }
    return throwError(() => new Error('Algo fallo. Intente nuevamente'));
  }


  get userData():Observable<User>{
    return this.currentUserData.asObservable();
  }

  get userLoginOn():Observable<boolean>{
    return this.currentUserLoginOn.asObservable();
  }*/


  private userUrl = 'http://localhost:8000/users/';
  headerDict: HeadersInit | undefined;


  constructor(private http: HttpClient){
    
  }

  /*register (formValue: any){
    return firstValueFrom(
      this.httpClient.post<any>(`${this.userUrl}`, formValue)
    );
  }*/

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

}
