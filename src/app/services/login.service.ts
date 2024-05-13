import { Injectable } from '@angular/core';
import { LoginRequest } from './loginRequest';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
  }

}
