import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../services/user';
import { UserService } from '../services/user.service';
import { Pub } from '../services/pub';
import { PublicationService } from '../services/publicacion.service';

@Component({
  selector: 'app-ver-perfil',
  templateUrl: './ver-perfil.component.html',
  styleUrls: ['./ver-perfil.component.css']
})
export class VerPerfilComponent {
  username!: string;
  publicaciones: any[]=[];
  user!: User;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private publicationService: PublicationService,
             ) { }

  ngOnInit(){
    this.username=this.route.snapshot.params['username'];
    this.userService.getUser(this.username).subscribe(
      (user: User) => {
        this.user = user;
    this.publicationService.getPublicationsById(this.user.id).subscribe(
      (publicaciones: Pub[]) => {
        this.publicaciones = publicaciones;
              });
      });
  }

  public getPhotos(id:number){
    return this.publicationService.getPhotos(id)
  }
}
