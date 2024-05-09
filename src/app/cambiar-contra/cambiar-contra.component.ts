import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'cambiar-contra',
  templateUrl: './cambiar-contra.component.html',
  styleUrls: ['./cambiar-contra.component.css']
})
export class CambiarContraComponent implements OnInit {

  cambiarContraForm: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder) { 
    this.cambiarContraForm = this.formBuilder.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(6)]],
      repetirContrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
   
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.cambiarContraForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  enviar() {
    this.submitted = true; // Marcar el formulario como enviado al hacer clic en el botón "Enviar"
    if (this.cambiarContraForm.invalid) {
      return; // Detener el envío del formulario si hay errores de validación
    }
    console.log(this.cambiarContraForm.value);
    // Aquí puedes realizar la lógica para enviar el formulario al backend
  }
}