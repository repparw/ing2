import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'cambiar-contra',
  templateUrl: './cambiar-contra.component.html',
  styleUrls: ['./cambiar-contra.component.css']
})
export class CambiarContraComponent implements OnInit {

  cambiarContraForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) {
    this.cambiarContraForm = this.formBuilder.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6), Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")]],
      repetirContrasena: ['', [Validators.required, Validators.minLength(6),  Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")]]
    });
  }

  ngOnInit(): void {

  }

  private _router = inject(Router)

  navigate(ruta: string): void{
    this._router.navigate([ruta])
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.cambiarContraForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit() : void{
    this.submitted = true; // Marcar el formulario como enviado al hacer clic en el botón "Enviar"

    if (this.cambiarContraForm.invalid) {
      console.log('El formulario es inválido. No se puede modificar.');
      return; // Detener el envío del formulario si hay errores de validación
    }
    if (this.cambiarContraForm.get('nuevaContrasena')?.value !== this.cambiarContraForm.get('repetirContrasena')?.value) {
      console.log('Las contraseñas no son iguales. No se puede modificar.');
      return; // Detener el envío del formulario si las contraseñas no son iguales
    }

    console.log('El formulario es válido. Realizando cambio de contraseña...');
    console.log(this.cambiarContraForm.value);
    Swal.fire('OK!','Contraseña reestablecida correctamente','success');
    this.navigate('login')

    // Aquí puedes realizar la lógica para enviar el formulario al backend
  }
}
