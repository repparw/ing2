import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.component.html',
  styleUrls: ['./editar-publicacion.component.css']
})
export class EditarPublicacionComponent {
  prodForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      category: ['', Validators.required],
      is_paused: [false],
      photos: new FormControl(),
      desired: [''],
      // fields not in form
      price: [0],
      user: [1],
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
//addPub(this.prodForm.value);
  console.log(this.prodForm.value);
  }
}

