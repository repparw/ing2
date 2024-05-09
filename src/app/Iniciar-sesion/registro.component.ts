import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  
  loginForm= this.formBuilder.group({
    mail: ['', [Validators.required, Validators.email]],
    contraseña: ['', Validators.required],
  })
  
  constructor(private formBuilder:FormBuilder, private router:Router){}

  ngOnInit(): void{

  }

  get mail(){
    return this.loginForm.controls.mail;
  }
  
  get contraseña(){
    return this.loginForm.controls.contraseña;
  }
   
  login(){
    if(this.loginForm.valid){
      console.log('Nice');
      this.router.navigateByUrl('/home');
      this.loginForm.reset;
    }
    else{
      this.loginForm.markAllAsTouched();
    }
  }
}
