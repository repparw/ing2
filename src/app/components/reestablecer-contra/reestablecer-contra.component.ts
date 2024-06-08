import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reestablecer-contra',
  templateUrl: './reestablecer-contra.component.html',
  styleUrls: ['./reestablecer-contra.component.css']
})
export class ReestablecerContraComponent implements OnInit, HttpInterceptor {
    reestablecerForm= this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('.*@.*')]],
    });

    userService = inject(UserService);
    private _router = inject(Router)

    constructor(private formBuilder:FormBuilder, private router:Router){}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

      return next.handle(request);
    }

    ngOnInit(): void{

    }

    get email(){
      return this.reestablecerForm.controls.email;
    }

requestPasswordReset() {
      Swal.fire({
        title: 'Procesando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      this.userService.requestPasswordReset(this.reestablecerForm.get('email')?.value || '').subscribe({
        next: (response) => {
          // Handle the response if needed
        },
        error: (error) => {
          // Handle the error if needed
        },
        complete: () => {
          // This block is intentionally left empty because finalize will handle both cases
        }
      }).add(() => {
        // This code will run regardless of success or error
        setTimeout(() => {
          Swal.close();
          Swal.fire({
            title: 'Solicitud de restablecimiento de contraseña',
            text: 'Si existe un usuario con el correo proporcionado, se enviará un correo con las instrucciones para restablecer la contraseña.',
            icon: 'info',
            confirmButtonText: 'Ok'
          }).then(() => {
            this.navigate('login');
          });
        }, 3000); // Espera 3 segundos antes de mostrar el mensaje de confirmación
      });
    }

    hasErrors(controlName: string, errortype: string){
      return this.reestablecerForm.get(controlName)?.hasError(errortype) && this.reestablecerForm.get(controlName)?.touched
    }

  navigate(ruta: string): void{
    this._router.navigate([ruta])
  }

}
