import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
      Validators.minLength(6)])
  });

  constructor(private formBuilder: FormBuilder){
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.employeeForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.employeeForm.invalid) {
      return; // Detener el envío del formulario si hay errores de validación
    }
    console.log(this.employeeForm.value);
  };
}

