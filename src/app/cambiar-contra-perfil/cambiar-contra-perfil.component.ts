import { formatCurrency } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-contra-perfil',
  templateUrl: './cambiar-contra-perfil.component.html',
  styleUrls: ['./cambiar-contra-perfil.component.css']
})
export class CambiarContraPerfilComponent {

  submitted = false;

  contraForm = new FormGroup({
    passwordActual: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")]),
    passwordNueva: new FormControl('', [Validators.required, Validators.minLength(6),  Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")])    
  })

  private _router = inject(Router)

  hasErrors(controlName: string, errorType: string) {
    const control = this.contraForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  navigate(ruta: string): void{
    this._router.navigate([ruta])
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.contraForm.invalid) {
      console.log('El formulario es inválido. No se puede modificar.');
      return; // Detener el envío del formulario si hay errores de validación
    }
    if (this.contraForm.get('passwordActual')?.value == this.contraForm.get('passwordNueva')?.value){
      console.log('Las contraseñas son iguales. No se puede modificar.');
      return; // Detener el envío del formulario si las 2 contraseñas son iguales
    }
    //Caso contrario modificar
    console.log('El formulario es válido. Realizando cambio de contraseña...');
    console.log(this.contraForm.value);
    alert('Contraseña cambiada correctamente');
    this.navigate('ver mi perfil')
  }
}


