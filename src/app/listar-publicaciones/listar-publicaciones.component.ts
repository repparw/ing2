import { Component, Input, OnInit } from '@angular/core';
import { PublicationService } from '../services/publicacion.service';
import { UserService } from '../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-listar-publicaciones',
  templateUrl: './listar-publicaciones.component.html',
  styleUrls: ['./listar-publicaciones.component.css']
})
export class ListarPublicacionesComponent implements OnInit {
  @Input() data: any[] = [];
  isEmployee$: Observable<boolean>;

  constructor (private publicationService: PublicationService, private userService: UserService){
    this.isEmployee$ = this.userService.isEmployee$;
  }

  ngOnInit(): void { }

  getPhotos(id: number): string {
    return this.publicationService.getPhotos(id);
  }
}
