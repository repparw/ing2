import { Component, Input, OnInit } from '@angular/core';
import { PublicationService } from '../../services/publicacion.service';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listar-publicaciones',
  templateUrl: './listar-publicaciones.component.html',
  styleUrls: ['./listar-publicaciones.component.css']
})
export class ListarPublicacionesComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() templateUrl: string = 'http://localhost:4200/publicacion/{{id}}';

  constructor (private publicationService: PublicationService){
  }

  ngOnInit(): void { }

  getPhotos(id: number): string {
    return this.publicationService.getPhotos(id);
  }

  generateLink(id: number): string {
    return this.templateUrl.replace('{{id}}', id.toString());
  }
}
