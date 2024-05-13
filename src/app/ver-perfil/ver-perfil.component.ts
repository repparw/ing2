import { Component } from '@angular/core';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.css']
})
export class VerPerfilComponent {
  fotoDePerfil: string = './././assets/logos/Principal.png';  //Poner foto de perfil por defecto en algún lado
  nombre: string = 'Patricio';
  apellido: string = 'Serres';
  valoracion: number = 7.2;
  publicaciones?: object[];

}
