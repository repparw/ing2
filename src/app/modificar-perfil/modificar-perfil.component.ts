import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';

import { MyValidations } from '../utils/my-validations';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.css']
})
export class ModificarPerfilComponent {
  fecha: Date = new Date(2003, 5, 16);

  userForm = new FormGroup({
    name: new FormControl('nombre',
      Validators.required),
    dni: new FormControl('44823594',
      Validators.required),
    email: new FormControl('patricio@gmail.com',[
      Validators.required,
      Validators.pattern('.*@.*')]),
    sucursal: new FormControl('La Plata',
    Validators.required),
    fechaDeNacimiento: new FormControl(this.fecha.toISOString().substr(0, 10),[
      Validators.required, 
    MyValidations.esMenorDeEdad])
  });

  private _router = inject(Router)

  constructor(private formBuilder: FormBuilder){
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  navigate(ruta: string): void{
    this._router.navigate([ruta])
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      console.log('El formulario es inválido o el usuario es menor de 18 años. No se puede modificar.');
      return; // Detener el envío del formulario si hay errores de validación
    }
    //Caso contrario modificar
    console.log('El formulario es válido y el usuario es mayor de 18 años. Realizando el registro...');
    console.log(this.userForm.value);
  }

}






