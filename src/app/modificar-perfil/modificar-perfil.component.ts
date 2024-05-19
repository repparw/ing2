import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { state } from '@angular/animations';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.css']
})
export class ModificarPerfilComponent implements OnInit{
  fecha: Date = new Date(2003, 5, 16);

  name = 'nombre'
  dni = '44823594'
  email = 'patricioserres@gmail.com'
  password = 'abcdefg@'

  contraVisible = false;

  userForm = new FormGroup({
    name: new FormControl('',
      Validators.required),
    dni: new FormControl(''),
    email: new FormControl(''),
    suc: new FormControl('La Plata',
    Validators.required),
    date: new FormControl(this.fecha.toISOString().substr(0, 10)),
    passwordActual: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`]")]),
    passwordNueva: new FormControl('', [Validators.required, Validators.minLength(6),  Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`]")])
  });

  private _router = inject(Router)

  constructor(private formBuilder: FormBuilder){
  }

  ngOnInit(): void {
    this.userForm.get('name')?.setValue(this.name)
    this.userForm.get('dni')?.setValue(this.dni)
    this.userForm.get('email')?.setValue(this.email)
    this.userForm.get('passwordActual')?.setValue(this.password)
    this.userForm.get('passwordNueva')?.setValue(this.password)
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  navigate(ruta: string): void{
    this._router.navigate([ruta])
  }

  showForm(){
    this.contraVisible = true;
    this.userForm.get('passwordActual')?.setValue('')
    this.userForm.get('passwordNueva')?.setValue('')
  }

  ocultarForm(){
    this.contraVisible = false;
    this.userForm.get('passwordActual')?.setValue(this.password)
    this.userForm.get('passwordNueva')?.setValue(this.password)
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      console.log('El formulario es inválido o el usuario es menor de 18 años. No se puede modificar.');
      return; // Detener el envío del formulario si hay errores de validación
    }
    //Caso contrario modificar
    console.log('El formulario es válido y el usuario es mayor de 18 años. Realizando el registro...');
    console.log(this.userForm.value);
  }

}






