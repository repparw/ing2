import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PublicationService } from '../../services/publicacion.service';
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

  constructor(
    private formBuilder: FormBuilder,
    private publicationService: PublicationService,
    private location: Location,
    private route: ActivatedRoute,
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
    });
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
        console.log('Publicación actualizada:', updatedPub);
        alert('Publicación actualizada correctamente');
        this.location.back(); // Navigate back after successful update
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
    if (confirm('¿Está seguro de que desea rechazar esta publicación?')) {
      this.publicationService.deletePublication(this.id).subscribe(
        () => {
          console.log('Publicación eliminada correctamente');
          alert('Publicación eliminada correctamente');
          this.location.back(); // Navigate back after deletion
        },
        error => {
          console.error('Error al eliminar la publicación:', error);
          // Handle error
        }
      );
    }
  }

  goBack(): void {
    this.location.back();
  }
}

