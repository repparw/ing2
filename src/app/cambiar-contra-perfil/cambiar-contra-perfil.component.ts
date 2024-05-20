import { formatCurrency } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cambiar-contra-perfil',
  templateUrl: './cambiar-contra-perfil.component.html',
  styleUrls: ['./cambiar-contra-perfil.component.css']
})
export class CambiarContraPerfilComponent {

  submitted = false;

  contraForm = new FormGroup({
    passwordActual: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`]")]),
    passwordNueva: new FormControl('', [Validators.required, Validators.minLength(6),  Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`]")])    
  })

  hasErrors(controlName: string, errorType: string) {
    const control = this.contraForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.contraForm.invalid) {
      console.log('El formulario es inválido o el usuario es menor de 18 años. No se puede modificar.');
      return; // Detener el envío del formulario si hay errores de validación
    }
    //Caso contrario modificar
    console.log('El formulario es válido y el usuario es mayor de 18 años. Realizando el registro...');
    console.log(this.contraForm.value);
  }
}