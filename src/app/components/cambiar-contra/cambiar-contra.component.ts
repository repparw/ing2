import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'cambiar-contra',
  templateUrl: './cambiar-contra.component.html',
  styleUrls: ['./cambiar-contra.component.css']
})
export class CambiarContraComponent implements OnInit {

  uidb64: string;
  token: string;

  cambiarContraForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
             ) {
    this.uidb64 = this.route.snapshot.queryParamMap.get('uidb64')!;
    this.token = this.route.snapshot.queryParamMap.get('token')!;

    this.cambiarContraForm = this.formBuilder.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6), Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")]],
      repetirContrasena: ['', [Validators.required, Validators.minLength(6),  Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")]]
    });
  }

  ngOnInit(): void {

  }


  navigate(ruta: string): void{
    this.router.navigate([ruta])
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

    this.userService.resetPassword(this.uidb64, this.token, this.cambiarContraForm.get('nuevaContrasena')?.value).subscribe(
      response => {
        Swal.fire('OK!', 'Contraseña reestablecida correctamente', 'success').then(() => {
          this.navigate('login');
                  });
      },
      error => {
        console.error(error);
        Swal.fire('Error', 'No se pudo reestablecer la contraseña', 'error');
      }
          );
  }
}
