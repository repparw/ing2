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
    email: ['', [Validators.required, Validators.email]],
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

  async login (){
    const response = await this.userService.login(this.loginForm.value);
    console.log(response);
    
  }


  /*login(){
    if(this.loginForm.valid){
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (userData) => {
          console.log(userData);
        },
        error: (errorData) => {
          console.error(errorData);
          this.loginError=errorData;
        },
        complete: () => {
          console.info("Login completo");
          this.router.navigateByUrl('/home');
          this.loginForm.reset;
        }
      })
    }
    else{
      this.loginForm.markAllAsTouched();
    }
  }

  hasErrors(controlName: string, errortype: string){
    return this.loginForm.get(controlName)?.hasError(errortype) && this.loginForm.get(controlName)?.touched
  }*/
}
