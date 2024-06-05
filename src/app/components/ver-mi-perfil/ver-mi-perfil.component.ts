import { Component, OnInit, inject} from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { Pub } from '../../models/pub';

@Component({
  selector: 'app-ver-mi-perfil',
  templateUrl: './ver-mi-perfil.component.html',
  styleUrls: ['./ver-mi-perfil.component.css']
})
export class VerMiPerfilComponent implements OnInit {
  fotoDePerfil: string = './assets/logos/Principal.png';  //Poner foto de perfil por defecto en algún lado
  nombre: string = '';
  valoracion: number = 0;
  publicaciones: any[]=[];
  dni: string = '';
  fechaDeNacimiento: Date = new Date(0, 0, 0);
  mail: string = '';
  sucursal: number = 1;

  constructor(private userService: UserService, private publicationService: PublicationService){}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(
      (user) => {
      this.nombre = user.name;
      this.dni = user.username;
      this.fechaDeNacimiento = user.date;
      this.mail = user.email;
      this.sucursal = user.suc;
      this.valoracion = user.rating!;
      this.publicationService.getPublicationsById(user.id).subscribe(
          (publications: Pub[]) => {
            this.publicaciones = publications;
      });
      }
    )
  }

  private _router = inject(Router)

  navigate(ruta: string): void{
    this._router.navigate([ruta])
  }


  public getPhotos(id:number){
    return this.publicationService.getPhotos(id)
  }

}

