import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../services/user';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { __values } from 'tslib';
import { zip } from 'rxjs';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {
  
  registroError: string = "";
  userForm = new FormGroup({
    name: new FormControl('',
      Validators.required),
    dni: new FormControl('',
      Validators.required),
    email: new FormControl('',[
      Validators.required,
      Validators.pattern('.*@.*')]),
    fechaNacimiento: new FormControl('',
     Validators.required),  
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)]),
    suc: new FormControl(1,
      Validators.required),
    mailing: new FormControl(false)
  });


  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService){
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.userForm.valid) {
      return
    }
    const currentDate = new Date();

    this.userService.createUser(this.userForm.value as User).subscribe(
      (response) => {
        console.log('Empleado creado exitosamente', response);
        this.router.navigateByUrl('/home');
    },
      (error) => {
        console.error('Error al crear empleado', error);
      }   
    )
  }

  /*async onSubmit(){
    const response = await this.userService.register(this.userForm.value);
    console.log(response);
  }*/

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  /*onSubmit(): void {
    if (this.userForm.invalid) {
      console.log('El formulario es inválido o el usuario es menor de 18 años. No se puede registrar.');
      return; 
    }
    console.log('El formulario es válido y el usuario es mayor de 18 años. Realizando el registro...');
    console.log(this.userForm.value);
  }*/

  esMayorDeEdad(fechaNacimiento: string): boolean {
    const hoy = new Date();
    const fechaNacimientoObj = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNacimientoObj.getFullYear();
    const mes = hoy.getMonth() - fechaNacimientoObj.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimientoObj.getDate())) {
      return edad < 18 ? false : true;
    }
    return edad < 18 ? false : true;
  }

  


}
