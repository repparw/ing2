import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../services/user';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent {
  userForm = new FormGroup({
    name: new FormControl('',
      Validators.required),
    apellido: new FormControl('',
       Validators.required),  
    dni: new FormControl('',
      Validators.required),
    email: new FormControl('',[
      Validators.required,
      Validators.pattern('.*@.*')]),
    fechaNacimiento: new FormControl('',
     Validators.required),  
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6)])
  });

  constructor(private formBuilder: FormBuilder){
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      console.log('El formulario es inválido o el usuario es menor de 18 años. No se puede registrar.');
      return; 
    }
    console.log('El formulario es válido y el usuario es mayor de 18 años. Realizando el registro...');
    console.log(this.userForm.value);
  }

  esMayorDeEdad(fechaNacimiento: string): boolean {
    const hoy = new Date();
    const fechaNacimientoObj = new Date(fechaNacimiento);
    const edad = hoy.getFullYear() - fechaNacimientoObj.getFullYear();
    const mes = hoy.getMonth() - fechaNacimientoObj.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimientoObj.getDate())) {
      return edad < 18 ? false : true;
    }
    return edad < 18 ? false : true;
  }


}
