import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Pub } from '../../models/pub'
import { User } from '../../models/user'
import { PublicationService } from '../../services/publicacion.service';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FileSelectDirective, FileUploader, FileItem } from 'ng2-file-upload';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-publicacion',
  templateUrl: './editar-publicacion.component.html',
  styleUrls: ['./editar-publicacion.component.css']
})

export class EditarPublicacionComponent implements OnInit {
  id!: number;
  public uploader!: FileUploader;
  userId!: number;

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
      queueLimit: 3 // Maximum 3 files allowed
    });

    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      this.prodForm.patchValue({ photos: this.uploader.queue.map(item => item.file) });
    };
  }

  getPublication(id: number): void {
   this.publicationService.getPublication(id).subscribe((pub: Pub) => {
        if (pub.user !== this.userId) { Swal.fire('Error','No está autorizado para editar esta publicación','error').then(() => this.location.back()); } else {
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

  goBack() {
    this.location.back();
      }

  onSubmit() {
    if (this.prodForm.invalid) {
      this.prodForm.markAllAsTouched();
      return;
    }

    const pub = this.prodForm.value as Partial<Pub>;
    this.publicationService.updatePublication(this.id, pub).subscribe(
      (pub: Pub) => {
        if (this.uploader.queue.length > 0) {
          this.publicationService.deletePhotos(this.id).subscribe(() => {

            this.uploader.uploadAll();

            this.uploader.onCompleteAll = () => {
              console.log('Photos uploaded successfully');
              Swal.fire('Publicación creada', 'La publicación ha sido creada exitosamente', 'success').then(() => {
              this.goBack();
              });

            this.uploader.onErrorItem = (item, response, status, headers) => {
              console.error('Error subiendo fotos:', response);
              };
            }
          });
        };
      },
    error => {
      Swal.fire('Error', 'No se ha podido actualizar la publicación', 'error');
  });
  }
}
