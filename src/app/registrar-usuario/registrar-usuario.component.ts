import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  
  registroError: string = "";
  userForm= this.formBuilder.group({
    name: ['', Validators.required],
      dni: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8)]],
      email: ['', [Validators.required, Validators.pattern('.*@.*')]],
      fechaNacimiento: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      suc: [1, Validators.required],
      rating: [0.00],
      mailing: [false]
  });

  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService){
  }

  ngOnInit(): void {}

  onSubmit() {
    //console.log(this.userForm.controls['fechaNacimiento'].value);
    if (this.userForm.invalid) {
      console.log("formulario invalido");
      console.log(this.userForm.errors);
      return
    }
    this.userService.createUser(this.userForm.value as User).subscribe(
      (response) => {
        console.log('usuario creado exitosamente', response);
        this.router.navigateByUrl('/home');
    },
      (error) => {
        //console.error('Error al crear usuario', error);
        this.registroError = "Error al registrar el usuario. Intente otra vez";
      }   
    )
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
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
