import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { LoginRequest } from '../services/loginRequest';
import { UserService } from '../services/user.service';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { cookieExtractor } from './cookie-extractor.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit, HttpInterceptor {
  loginError:string = "";
  loginForm= this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required],
  });
  
  //xsrf: string   = <string>this.cookieExtractor.getToken(); 
  userService = inject(UserService);

  constructor(private formBuilder:FormBuilder, private router:Router){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /*request = request.clone({
      headers:  new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': this.xsrf }),
      withCredentials: true
    });*/

    return next.handle(request);
  }

  ngOnInit(): void{

  }

  get email(){
    return this.loginForm.controls.email;
  }
  
  get password(){
    return this.loginForm.controls.password;
  }

  login() {
    if (this.loginForm.valid) {

      const {email, password } = this.loginForm?.value;
      this.userService.login( email! , password!).subscribe(
      response => {
        console.log('Login successful', response);
        this.router.navigateByUrl('/home');
      },
      error => {
        console.error('Login failed', error);
      }
    );
    }
  }

  logout() {
    this.userService.logout();
    this.router.navigateByUrl('/login'); // Redirige al usuario a la página de inicio de sesión
  }

  isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  hasErrors(controlName: string, errortype: string){
    return this.loginForm.get(controlName)?.hasError(errortype) && this.loginForm.get(controlName)?.touched
  }
}
