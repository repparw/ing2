import { formatCurrency } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, pluck, take } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../services/user';

@Component({
  selector: 'app-cambiar-contra-perfil',
  templateUrl: './cambiar-contra-perfil.component.html',
  styleUrls: ['./cambiar-contra-perfil.component.css']
})
export class CambiarContraPerfilComponent {

  id: number = 0;
  submitted = false;

  contraForm = new FormGroup({
    passwordActual: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")]),
    passwordNueva: new FormControl('', [Validators.required, Validators.minLength(6),  Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")])
  })

  private _router = inject(Router)
  private userService = inject(UserService)

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
      return; // Stop form submission if there are validation errors
    }

    if (this.contraForm.get('passwordActual')?.value === this.contraForm.get('passwordNueva')?.value) {
      console.log('Las contraseñas son iguales. No se puede modificar.');
      return; // Stop form submission if the new password is the same as the current password
    }

    const passwordActual = this.contraForm.get('passwordActual')?.value ?? '';
    const passwordNueva = this.contraForm.get('passwordNueva')?.value ?? '';

    console.log('El formulario es válido. Realizando cambio de contraseña...');
    this.userService.changePassword(passwordActual, passwordNueva, passwordNueva).subscribe(
      () => {
        console.log('Contraseña modificada correctamente.');
        this.navigate('ver-mi-perfil'); // Navigate to 'ver mi perfil' after successful password change
      },
      error => {
        console.log('Error al modificar la contraseña.', error);
      }
    );
  }

}


