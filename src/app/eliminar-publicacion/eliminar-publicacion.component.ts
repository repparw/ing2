import { Component, Input } from '@angular/core';
import { PublicationService } from '../services/publicacion.service';
import { Pub } from '../services/pub';

@Component({
  selector: 'app-eliminar-publicacion',
  templateUrl: './eliminar-publicacion.component.html',
  styleUrls: ['./eliminar-publicacion.component.css']
})
export class EliminarPublicacionComponent {

  constructor(private publicationService: PublicationService) { }

  deletePublication(id: number) {
    this.publicationService.deletePublication(id).subscribe((pub: Pub) => {
      console.log('Publicación eliminada');
    });
  }
}
