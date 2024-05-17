import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PublicationService } from '../services/publicacion.service';
import { Pub } from '../services/pub'
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})

export class CrearPublicacionComponent {
  public uploader: FileUploader = new FileUploader({ url: 'http://localhost:8000/publications/', itemAlias: 'photos' })

  prodForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      category: ['', Validators.required],
      is_paused: [false],
      photos: new FormControl<File | null>(null, Validators.required),
      desired: [''],
      // fields not in form
      price: [0],
      user: [1],
  });

  constructor(private formBuilder: FormBuilder, private publicationService:PublicationService, private router:Router){ }

  ngOnInit() {
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
  this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
    form.append('title', this.prodForm.get('title')?.value);
    form.append('desc', this.prodForm.get('desc')?.value);
    form.append('category', this.prodForm.get('category')?.value);
    form.append('is_paused', this.prodForm.get('is_paused')?.value);
    form.append('desired', this.prodForm.get('desired')?.value);
    form.append('price', this.prodForm.get('price')?.value);
    form.append('user', this.prodForm.get('user')?.value);
  }
  console.log('Agregando formulario a la base de datos');
  this.uploader.uploadAll();
  console.log('Formulario agregado a la base de datos', this.prodForm.value);
  this.router.navigate(['/publicacion/19']);
  }

}
