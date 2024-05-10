import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent {
  prodForm = new FormGroup({
    title: new FormControl('',
      Validators.required),
    desc: new FormControl('',
      Validators.required),
    cat: new FormControl('',
      Validators.required),
// TODO limitar cantidad de imagenes
    img: new FormControl('',
      Validators.required),
    desiredProds: new FormControl(''),
  });

  constructor(private formBuilder: FormBuilder){
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.prodForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit() {
  if (this.prodForm.invalid) {
    this.prodForm.markAllAsTouched();
    return; // Detener el envío del formulario si hay errores de validación
  }
  console.log(this.prodForm.value);
  }
}
