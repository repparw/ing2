import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Pub } from '../../models/pub'
import { User } from '../../models/user'
import { PublicationService } from '../../services/publication.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FileSelectDirective, FileUploader, FileItem } from 'ng2-file-upload'; import Swal from 'sweetalert2';
@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.component.html',
  styleUrls: ['./editar-publicacion.component.css']
})

export class EditarPublicacionComponent implements OnInit {
  id!: number;
  public uploader!: FileUploader;
  userId!: number;
  selectedFiles: File[] = [];

  prodForm: FormGroup;

  apiUrl = 'http://localhost:8000/publications/';

  constructor(
    private formBuilder: FormBuilder,
    private publicationService: PublicationService,
    private userService: UserService,
    private location: Location,
    private route: ActivatedRoute,
  ) {
    this.prodForm = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      desc: new FormControl('', Validators.required),
      category: new FormControl(''),
      is_paused: new FormControl(false),
      photos: new FormControl<File[] | null>(null, Validators.required),
      desired: new FormControl(''),
      rating: new FormControl(0),
      price: new FormControl(0),
      user: new FormControl(0),
    });
  }

  ngOnInit() {
    this.id = parseInt(this.route.snapshot.params['id']);
    const authToken = localStorage.getItem('token');
    this.userService.getCurrentUser().subscribe(
      user => {
        this.userId = user.id;
        this.getPublication(this.id);
      });
    this.prodForm.get('cat')?.disable()
    this.initializeUploader();
  }

  initializeUploader() {
    const authToken = localStorage.getItem('token');
    this.uploader = new FileUploader({
      url: `${this.apiUrl}${this.id}/upload_photos/`,
      itemAlias: 'photos',
      authTokenHeader: 'Authorization',
      authToken: `Token ${localStorage.getItem('token')}`,
      method: 'PUT',
    });

    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      this.prodForm.patchValue({ photos: this.uploader.queue.map(item => item.file) });
    };
  }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
    this.uploader.clearQueue();
    this.uploader.addToQueue(this.selectedFiles);
  }

  getPublication(id: number): void {
    this.publicationService.getPublication(id).subscribe((pub: Pub) => {
      if (pub.user !== this.userId) { Swal.fire('Error', 'No está autorizado para editar esta publicación', 'error').then(() => this.goBack()); } else {
        this.prodForm = this.getForm(pub);
      }
    })
  }

  getForm(data: Pub) {
    return new FormGroup({
      title: new FormControl(data.title, Validators.required),
      desc: new FormControl(data.desc, Validators.required),
      category: new FormControl(data.category),
      is_paused: new FormControl(data.is_paused),
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

  goBack(): void {
    window.location.href = '..';
  }

  goBackAndRefresh() {
    this.location.back();  // Navigate back
    setTimeout(() => {
      window.location.reload();  // Refresh the page after navigation
    }, 500);  // Delay to ensure the navigation is completed before refreshing
  }


  onSubmit() {
    if (this.prodForm.invalid) {
      this.prodForm.markAllAsTouched();
      return;
    }

    const pub = this.prodForm.value as Partial<Pub>;
    this.publicationService.updatePublication(this.id, pub).subscribe(
      (pub: Pub) => {
        if (this.uploader.queue.length > 3) {
          Swal.fire('Error', 'No se pueden subir más de 3 fotos', 'error');
          return;
        }
        else if (this.uploader.queue.length === 0) {
          Swal.fire('Publicación editada', 'La publicación ha sido editada exitosamente', 'success').then(() => {
            this.goBack();
          });
        }
        else {
          this.publicationService.deletePhotos(this.id).subscribe(() => {

            this.uploader.uploadAll();

            this.uploader.onCompleteAll = () => {
              console.log('Fotos subidas exitosamente');
              Swal.fire('Publicación editada', 'La publicación ha sido editada exitosamente', 'success').then(() => {
                this.goBackAndRefresh();
              });

              this.uploader.onErrorItem = (item, response, status, headers) => {
                console.error('Error subiendo fotos:', response);
              };
            }
          });
        }

      },
      error => {
        Swal.fire('Error', 'No se ha podido actualizar la publicación', 'error');
      });
  }
}
