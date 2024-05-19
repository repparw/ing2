import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Router } from '@angular/router';
import { state } from '@angular/animations';
import { UserService } from '../services/user.service';
import { User } from '../services/user';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.css']
})
export class ModificarPerfilComponent implements OnInit {

  userForm : FormGroup<any> = new FormGroup<any>({});

  private _router = inject(Router)

  constructor(private formBuilder: FormBuilder, private userService: UserService){
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
      this.userForm = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      username: new FormControl(user.username),
      email: new FormControl(user.email),
      suc: new FormControl(user.suc, Validators.required),
      mailing: new FormControl(user.mailing),
      date: new FormControl(user.date),
      });
      });
  }

  getForm(user: User) {
    return new FormGroup({
      name: new FormControl(user.name, Validators.required),
      username: new FormControl(user.username),
      email: new FormControl(user.email),
      suc: new FormControl(user.suc, Validators.required),
      mailing: new FormControl(user.mailing),
      date: new FormControl(user.date),
    });
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  navigate(ruta: string): void{
    this._router.navigate([ruta])
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






