import { Component, inject} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-mi-perfil',
  templateUrl: './ver-mi-perfil.component.html',
  styleUrls: ['./ver-mi-perfil.component.css']
})
export class VerMiPerfilComponent {
  fotoDePerfil: string = './././assets/logos/Principal.png';  //Poner foto de perfil por defecto en algún lado
  nombre: string = 'Patricio Serres';
  valoracion: number = 7.2;
  publicaciones?: object[];
  dni: number = 44823594;
  fechaDeNacimiento: Date = new Date(2003, 5, 16);
  mail: string = 'messi@yahoo.com';
  sucursal: string = 'La Plata';

  private _router = inject(Router)

  navegate(ruta: string): void{
    this._router.navigate([ruta])
  }

}


