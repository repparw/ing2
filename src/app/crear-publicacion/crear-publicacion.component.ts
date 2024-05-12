import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PublicationService } from '../services/publicacion.service';
import { Pub } from '../services/pub'

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})

export class CrearPublicacionComponent {
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

  constructor(private formBuilder: FormBuilder, private publicationService:PublicationService){ }

  ngOnInit() {
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.prodForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onFileSelected(event: any) {
  const selectedFiles = event.target.files;

  if (selectedFiles.length > 0) {
    // Multiple files selected, handle them appropriately
    this.prodForm.patchValue({ photos: selectedFiles }); // Set photos to an array of files
    this.prodForm.get('photos')?.updateValueAndValidity();

    // Optional: Loop through selectedFiles and perform additional processing
    for (const file of selectedFiles) {
      // ... process each file (e.g., display filename, perform validation)
    }
  } else {
    // No file selected, handle the case (optional)
    console.warn('No files selected for upload');
    this.prodForm.patchValue({ photos: null }); // Optionally set photos to null
  }
}

  onSubmit() {
  if (this.prodForm.invalid) {
    this.prodForm.markAllAsTouched();
    return; // Detener el envío del formulario si hay errores de validación
  }

  this.publicationService.createPublication(this.prodForm.value as Pub).subscribe(
      (response) => {
        console.log('Publicación creada exitosamente', response);
      },
      (error) => {
        console.error('Error al crear la publicación', error);
      }
  );
  }
}
