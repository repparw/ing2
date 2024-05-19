import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { LoginRequest } from '../services/loginRequest';
import { UserService } from '../services/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  loginError:string = "";
  loginForm= this.formBuilder.group({
    email: ['', [Validators.required]],
    password: ['', Validators.required],
  });
  
  userService = inject(UserService);

  constructor(private formBuilder:FormBuilder, private router:Router){}

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

  /*login() {
    if (this.loginForm.invalid) {
      console.log("Formulario inválido");
      return;
    }
    

    this.userService.login(this.loginForm.value).subscribe(
      response => {
        console.log('Login exitoso', response);
        //localStorage.setItem('token', response);
        //localStorage.setItem('user', JSON.stringify(response.user));
        this.router.navigate(['/home']);
      },
      error => {
        console.error('Error al hacer login', error);
        this.loginError = "Email o contraseña incorrectos";
      }
    );
  }*/

  hasErrors(controlName: string, errortype: string){
    return this.loginForm.get(controlName)?.hasError(errortype) && this.loginForm.get(controlName)?.touched
  }
}
