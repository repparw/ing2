import { Component, Input } from '@angular/core';
import { PublicationService } from '../services/publicacion.service';

@Component({
  selector: 'app-listar-publicaciones',
  templateUrl: './listar-publicaciones.component.html',
  styleUrls: ['./listar-publicaciones.component.css']
})
export class ListarPublicacionesComponent {
  @Input() data: any[] = [];

  constructor (public publicationService:PublicationService){ }

  getPhotos(id: number): string {
    return this.publicationService.getPhotos(id);
  }
}
