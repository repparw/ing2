import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

import { PublicationService } from '../../services/publication.service';
import { Pub } from '../../models/pub';

@Component({
  selector: 'app-tasar-publicacion',
  templateUrl: './tasar-publicacion.component.html',
  styleUrls: ['./tasar-publicacion.component.css']
})

export class TasarPublicacionComponent implements OnInit {
  id!: number;
  pubForm: FormGroup;
  publication: Pub | undefined;
  linkFoto: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private publicationService: PublicationService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.pubForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      category: ['', Validators.required],
      is_paused: [{value: false, disabled: true}],
      desired: [''],
      price: [0, [Validators.required, Validators.min(0.01)]],
    });
  }

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.params['id']);
    this.getPublication(this.id);
  }

  getPublication(id: number): void {
    this.publicationService.getPublication(id).subscribe((pub: Pub) => {
      this.publication = pub;
      this.populateForm(pub);
      this.loadPhotos(id);
    });
  }

  loadPhotos(id: number): void {
    this.publicationService.getPhotos(id).subscribe(
      (data: string[]) => {
        this.linkFoto = data;
      },
      error => {
        console.error('Error fetching photos:', error);
      }
    );
  }

  populateForm(pub: Pub): void {
    this.pubForm.patchValue({
      title: pub.title,
      desc: pub.desc,
      category: pub.category,
      is_paused: pub.is_paused,
      desired: pub.desired,
      price: pub.price,
    });

    this.pubForm.get('price')?.markAsTouched();
  }

  hasErrors(controlName: string, errorType: string): boolean {
    const control = this.pubForm.get(controlName);
    return control?.hasError(errorType) || false;
  }

  onSubmit(): void {
    if (this.pubForm.invalid) {
      this.pubForm.markAllAsTouched();
      return;
    }

    const updatedPub = this.pubForm.value as Partial<Pub>;
    this.publicationService.updatePublication(this.id, updatedPub).subscribe(
      (updatedPub: Pub) => {
        Swal.fire('Actualizada',
                  'Publicación actualizada correctamente',
                  'success',
                ).then(() => { this.router.navigate(['/tasar-publicaciones']) }); //.then(()=> { window.location.reload(); })});
      },
      error => {
        console.error('Error al actualizar la publicación:', error);
        // Handle error
      }
    );
  }

  isPriceModified(): boolean {
    return this.pubForm.value.price !== 0;
  }

  deletePublication(): void {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Está seguro de que desea rechazar esta publicación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
          }).then((result) => {
      if (result.isConfirmed) {
        // TODO cambiar delete para q modifique el estado?
        this.publicationService.deletePublication(this.id).subscribe(
          () => {
            // TODO notificar via mail al usuario que su publicacion fue rechazada
            Swal.fire(
              'Eliminada',
              'Publicación eliminada correctamente',
              'success',
            ).then(() => { this.router.navigate(['/tasar-publicaciones']) });
          },
          error => {
            console.error('Error al eliminar la publicación:', error);
            // Handle error
          });
    }
    });
  }

  goBack(): void {
    window.history.back();
  }
}

