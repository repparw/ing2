import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/empleado.service';
import { Empleado } from '../services/empleado'

@Component({
  selector: 'app-registro-empleado',
  templateUrl: './registro-empleado.component.html',
  styleUrls: ['./registro-empleado.component.css']
})

export class RegistroEmpleadoComponent {
  employeeForm = new FormGroup({
    name: new FormControl('',
      Validators.required),
    dni: new FormControl('',
      Validators.required),
    email: new FormControl('',[
      Validators.required,
      Validators.pattern('.*@.*')]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)]),
    suc: new FormControl(1,
      Validators.required)
  });

  constructor(private formBuilder: FormBuilder, private router:Router, private employeeService:EmployeeService){ }

  hasErrors(controlName: string, errorType: string) {
    const control = this.employeeForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return; // Detener el envío del formulario si hay errores de validación
    }

  this.employeeService.createEmployee(this.employeeForm.value as Empleado).subscribe(
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

