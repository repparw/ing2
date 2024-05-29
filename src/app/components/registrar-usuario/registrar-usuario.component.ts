import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { __values } from 'tslib';

import { User } from '../../models/user';
import { Sucursal } from '../../models/sucursal';

import { UserService } from '../../services/user.service';
import { SucursalService } from '../../services/sucursal.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-registrar-usuario',
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css']
})
export class RegistrarUsuarioComponent implements OnInit {

  registroError: string = "";
  sucursales: Sucursal[] = [];

  userForm= this.formBuilder.group({
    name: ['', Validators.required],
    username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(8), Validators.pattern('^([0-9])*$')]],
    email: ['', [Validators.required, Validators.pattern('.*@.*')]],
    date:  new FormControl<Date | null> (null , [Validators.required, this.legalAge()]),
    password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(".*[!@#$%^&*()_+}{:;'?/><,.\|~`].*")]],
    suc: [0, Validators.required],
    rating: [0.00],
    mailing: [false],
    is_staff: new FormControl (false)
  });

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private userService: UserService,
              private emailService: EmailService,
              private sucursalService: SucursalService,
             ){
  }

  ngOnInit(): void {
    this.sucursalService.getSucursales().subscribe(
      (sucursales: Sucursal[]) => {
        this.sucursales = sucursales;
      },
      (error) => {
        console.error('Error fetching sucursales', error);
      }
    );
  }

  onSubmit() {
    //console.log(this.userForm.controls['fechaNacimiento'].value);
    if (this.userForm.invalid ) {
      console.log("formulario invalido");

      console.log(this.userForm.errors);
      return
    }
    const fechaNacimiento = this.userForm.get('fechaNacimiento');
    if (fechaNacimiento) {
      this.registroError = "El usuario debe ser mayor de 18 años para registrarse.";
      return;
  }
    this.userService.createUser(this.userForm.value as User).subscribe(
      (response) => {
        console.log('usuario creado exitosamente', response);
        this.sendEmail("Registro exitoso", "Felicitaciones!", [ this.userForm.get('email')?.value?.toString() || '' ])
        this.router.navigateByUrl('/home');
    },
      (error) => {
        this.registroError += "DNI o email ya registrados.";
      }
    )
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.userForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  legalAge(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const today = new Date();
      const birthDate = new Date(control.value);
      // contemplate day of birth
      const age = this.getAge(birthDate);
      if (age < 18) {
        return { legalAge: true };
      }
      return null;
    };
      }

  private getAge(date: Date) {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() <= birthDate.getDate())) {
      age--;
    }
    return age;
  }

  sendEmail(subject:string, message:string, recipientList:string[]) {
    this.emailService.sendEmail(subject, message, recipientList).subscribe(
      response => {
        console.log('Email enviado exitosamente', response);
      },
      error => {
        console.error('Error enviando email', error);
      }
    );
  }


}
