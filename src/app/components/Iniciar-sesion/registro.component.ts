import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { LoginRequest } from '../../services/loginRequest';
import { UserService } from '../../services/user.service';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  userService = inject(UserService);

  constructor(private formBuilder:FormBuilder, private router:Router){}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

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
      const { email, password } = this.loginForm.value;
      this.userService.login(email!, password!).subscribe(
        response => {
          console.log('Login exitoso', response);
          this.router.navigateByUrl('/home');
        },
        error => {
          console.error('Login fallido', error);
          this.loginError = "Login fallido. Revise sus credenciales e intente nuevamente";
        }
      );
    }
  }

  isAuthenticated(): boolean {
    return this.userService.isAuthenticated();
  }

  hasErrors(controlName: string, errortype: string){
    return this.loginForm.get(controlName)?.hasError(errortype) && this.loginForm.get(controlName)?.touched
  }
}
