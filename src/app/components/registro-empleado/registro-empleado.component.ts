import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-registro-empleado',
  templateUrl: './registro-empleado.component.html',
  styleUrls: ['./registro-empleado.component.css']
})


export class RegistroEmpleadoComponent {
  employeeForm = new FormGroup({
    name: new FormControl('',
      Validators.required),
    username: new FormControl('',[
      Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^([0-9])*$/)]),
    email: new FormControl('',[
      Validators.required,
      Validators.pattern('.*@.*')]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")
    ]),
    suc: new FormControl(1,
      Validators.required),
    is_employee: new FormControl(true)
  });

  constructor(private formBuilder: FormBuilder, private router:Router, private userService: UserService){ }

  hasErrors(controlName: string, errorType: string) {
    const control = this.employeeForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return; // Detener el envío del formulario si hay errores de validación
    }

  this.userService.createUser(this.employeeForm.value as User).subscribe(
    (response) => {
      console.log('Empleado creado exitosamente', response);
      // go to home
      this.router.navigateByUrl('/home');
    },
    (error) => {
      console.error('Error al crear empleado', error);
    }
      );
  };
}

