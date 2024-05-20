import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
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
esMayorDeEdad(arg0: never) {
throw new Error('Method not implemented.');
}

  registroError: string = "";
  userForm= this.formBuilder.group({
    name: ['', Validators.required],
    username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^([0-9])*$')]],
    email: ['', [Validators.required, Validators.pattern('.*@.*')]],
    date:  new FormControl<Date | null> (null , [Validators.required, this.esMayorDeEdadV()]),
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")]],
    suc: [1, Validators.required],
    rating: [0.00],
    mailing: [false],
    is_employee: new FormControl (false)
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService){
  }

  ngOnInit(): void {}

  onSubmit() {
    //console.log(this.userForm.controls['fechaNacimiento'].value);
    if (this.userForm.invalid ) {
      console.log("formulario invalido");

      console.log(this.userForm.errors);
      return
    }
    const fechaNacimiento = this.userForm.get('fechaNacimiento');
    if (fechaNacimiento) {
      console.log("El usuario debe ser mayor de 18 años para registrarse.");
      return;
  }
    this.userService.createUser(this.userForm.value as User).subscribe(
      (response) => {
        console.log('usuario creado exitosamente', response);
        this.router.navigateByUrl('/home');
    },
      (error) => {
        console.error('Error al crear usuario', error);
        this.registroError = "Error al registrar el usuario. Intente otra vez";
      }
    )
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  esMayorDeEdadV(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value || isNaN(new Date(value).getTime())) {
        return { 'invalidDate': true };
      }

      const hoy = new Date();
      const fechaNacimientoObj = new Date(value);
      const edad = hoy.getFullYear() - fechaNacimientoObj.getFullYear();
      const mes = hoy.getMonth() - fechaNacimientoObj.getMonth();

      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimientoObj.getDate())) {
        return edad < 18 ? { 'menorDeEdad': true } : null;
      }

      return edad < 18 ? { 'menorDeEdad': true } : null;
    };
  }


}
