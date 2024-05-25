import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { __values } from 'tslib';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { state } from '@angular/animations';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.component.html',
  styleUrls: ['./modificar-perfil.component.css']
})
export class ModificarPerfilComponent implements OnInit {

  userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl(''),
      email: new FormControl(''),
      suc: new FormControl(0, Validators.required),
      mailing: new FormControl(false),
      date: new FormControl(new Date()),
      });


  constructor(private formBuilder: FormBuilder, private userService: UserService, private location: Location){
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      (user: User) => {
      this.userForm.controls['name'].setValue(user.name);
      this.userForm.controls['username'].setValue(user.username);
      this.userForm.controls['email'].setValue(user.email);
      this.userForm.controls['suc'].setValue(user.suc);
      this.userForm.controls['mailing'].setValue(user.mailing as boolean);
      this.userForm.controls['date'].setValue(user.date);
      });
    this.userForm.get('username')?.disable()
    this.userForm.get('email')?.disable()
    this.userForm.get('date')?.disable()
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      console.error('El formulario es inválido. No se puede modificar.');
      return; // Detener el envío del formulario si hay errores de validación
    }
    //Caso contrario modificar
    console.log('El formulario es válido. Realizando el registro...');
    const userData = this.userForm.value as User;
    this.userService.updateUser(userData).subscribe(
      (user: User) => {
        console.log('Usuario modificado:', user);
        alert('Usuario modificado correctamente');
        this.location.back();
      });
  }

}






