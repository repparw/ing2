import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Pub } from '../services/pub'
import { PublicationService } from '../services/publicacion.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.component.html',
  styleUrls: ['./editar-publicacion.component.css']
})

export class EditarPublicacionComponent implements OnInit {
  id!: number;
  public uploader!: FileUploader;
  prodForm = new FormGroup({
    title: new FormControl('', Validators.required),
    desc: new FormControl('', Validators.required),
    category: new FormControl(''),
    is_paused: new FormControl(false),
    photos: new FormControl<File | null>(null),
    desired: new FormControl(''),
    rating: new FormControl(0),
    price: new FormControl(0),
    user: new FormControl(0),
      });

  constructor(
    private formBuilder: FormBuilder,
    private publicationService: PublicationService,
    private location: Location,
    private route: ActivatedRoute,
  ){ }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.params['id']);
    this.uploader = new FileUploader({ url: 'http://localhost:8000/publications/'+this.id+'/', itemAlias: 'photos' })
    this.getPublication(this.id);
    this.uploader.onBeforeUploadItem = this.onBeforeUploadItem;
    
    this.prodForm.get('category')?.disable()

  }

  onBeforeUploadItem(item: any) {
    item.method = 'PUT';
  }

  getPublication(id: number): void {
   this.publicationService.getPublication(id).subscribe((pub: Pub) => {
    this.prodForm = this.getForm(pub);
          })
  }

  getForm(data: Pub) {
    return new FormGroup({
      title: new FormControl(data.title, Validators.required),
      desc: new FormControl(data.desc, Validators.required),
      category: new FormControl(data.category),
      is_paused: new FormControl(data.is_paused),
      photos: new FormControl<File | null>(data.photos),
      desired: new FormControl(data.desired),
      rating: new FormControl(data.rating),
      price: new FormControl(data.price),
      user: new FormControl(data.user),
          });
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.prodForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  goBack() {
    this.location.back();
      }

  handleFileUpload(pubId: number, data: any[]) {
    // Check if there are any files selected in the uploader
  if (this.uploader.queue.length === 0) {
    // No files selected, send update request directly
    return;
  }

  // If files are selected, iterate through them and upload
  this.uploader.queue.forEach((fileItem) => {
    // Access file information from fileItem
    const selectedFile = fileItem.file;

    // Modify onBuildItemForm to append product update data (excluding file)
    this.uploader.onBuildItemForm = (item: any, form: any) => {
      form.append('file', selectedFile); // Append the selected file
    };

    // Upload the file with updated product data
    this.uploader.uploadItem(fileItem);
  });
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
  }
}
