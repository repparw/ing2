import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import Swal from 'sweetalert2';

import { PublicationService } from '../../services/publicacion.service';
import { UserService } from '../../services/user.service';
import { Pub } from '../../models/pub';


@Component({
  selector: 'app-crear-publicacion',
  templateUrl: './crear-publicacion.component.html',
  styleUrls: ['./crear-publicacion.component.css']
})
export class CrearPublicacionComponent {
  public uploader: FileUploader;
  private apiUrl = 'http://localhost:8000/publications/';
  selectedFiles: File[] = [];

  prodForm = this.formBuilder.group({
    title: ['', Validators.required],
    desc: ['', Validators.required],
    category: ['', Validators.required],
    is_paused: [false],
    photos: new FormControl<File[] | null>(null, Validators.required),
    desired: [''],
    // not in form
    price: [0],
    user: [0],
    rating: [0],
  });


  constructor(
    private formBuilder: FormBuilder,
    private publicationService: PublicationService,
    private userService: UserService,
    private router: Router
  ) {
    this.uploader = new FileUploader({
      url: this.apiUrl,
      itemAlias: 'photos',
      authTokenHeader: 'Authorization',
      authToken: `Token ${localStorage.getItem('token')}`,
    });
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.prodForm.patchValue({ user: user.id });
    });
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    this.uploader.clearQueue();
    this.uploader.addToQueue(this.selectedFiles);
  }


  hasErrors(controlName: string, errorType: string) {
    const control = this.prodForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.prodForm.invalid) {
      this.prodForm.markAllAsTouched();
      return;
    }

    if (this.uploader.queue.length > 3) {
      // Check if more than 3 files are selected
      Swal.fire('Error', 'No se pueden seleccionar más de 3 fotos', 'error');
      return;
    }

    this.publicationService.createPublication(this.prodForm.value as Pub).subscribe(
      response => {
        const pubId = response.id!;
        const uploadUrl = `${this.apiUrl}${pubId}/upload_photos/`;
        this.uploader.setOptions({ url: uploadUrl });


        if (this.uploader.queue.length > 0) {
          this.uploader.uploadAll();

          this.uploader.onCompleteAll = () => {
            console.log('Photos uploaded successfully');
            Swal.fire('Publicación creada', 'La publicación ha sido creada exitosamente', 'success').then(() => {
            this.router.navigate(['/home']);});
          };

          this.uploader.onErrorItem = (item, response, status, headers) => {
            console.error('Error uploading photos:', response);
          };
        } else {
          this.router.navigate(['/home']);
        }
      },
      error => console.error('Error creating publication:', error)
    );
  }

}
