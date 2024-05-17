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
  userForm!: FormGroup;


  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService){
  }

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      dni: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('.*@.*')]],
      fechaNacimiento: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      suc: [1, Validators.required],
      rating: [0.00],
      mailing: [false]
    });
  }

  onSubmit() {
    if (this.userForm.invalid) {
      console.log("formulario invalido");
      console.log(this.userForm.errors);
      return
    }
    const formValues = this.userForm.value;
    const userPayload = {
      name: formValues.name,
      dni: formValues.dni,
      email: formValues.email,
      password: formValues.password,
      date: this.formatDate(formValues.fechaNacimiento),
      mailing: formValues.mailing,
      rating: formValues.rating,
      suc: formValues.suc
    };
    this.userService.createUser(this.userForm.value as User).subscribe(
      (response) => {
        console.log('Empleado creado exitosamente', response);
        this.router.navigateByUrl('/home');
    },
      (error) => {
        console.error('Error al crear empleado', error);
        this.registroError = "Error al registrar el usuario. Intente otra vez";
      }   
    )
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
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
