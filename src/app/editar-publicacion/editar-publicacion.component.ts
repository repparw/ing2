import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Pub } from '../services/pub'
import { PublicationService } from '../services/publicacion.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.component.html',
  styleUrls: ['./editar-publicacion.component.css']
})

export class EditarPublicacionComponent implements OnInit {
  @Input() pub: Pub;
  prodForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      category: [''],
      is_paused: [false],
      photos: new FormControl(),
      desired: [''],
      // fields not in form
      price: [0],
      user: [1],
  });

  editPub(pub: Pub): Observable<Pub> {
    // castear datos a prodForm
    if (this.pub) {
      this.prodForm.patchValue(this.pub);
  }

  constructor(private formBuilder: FormBuilder){
  }

  ngOnInit() {
    }
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

