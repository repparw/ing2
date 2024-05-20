import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { Pub } from '../services/pub';
import { Observable, pluck, take, map, switchMap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { PublicationService } from '../services/publicacion.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-publicacion',
  templateUrl: './ver-publicacion.component.html',
  styleUrls: ['./ver-publicacion.component.css']
})
export class VerPublicacionComponent implements OnInit{
  data!: Pub;
  username!: string;
  linkFoto!: any;
  productID!: number;
  canEdit!: boolean;

  constructor (private route: ActivatedRoute, private  publicationService: PublicationService, private userService: UserService, private router:Router ){

  }

  ngOnInit(): void {
    this.productID = parseInt(this.route.snapshot.params['id']);
    console.log(this.productID);

    this.publicationService.getPublication(this.productID).pipe(
      switchMap(publication => {
        this.data = publication;
        this.linkFoto = this.publicationService.getPhotos(this.productID);

        return forkJoin([
          this.userService.isOwner(publication).pipe(take(1)),
          this.userService.getUser(publication.user).pipe(take(1), pluck('username'))
        ]).pipe(
          map(([isOwner, username]) => {
            return { isOwner, username };
          })
        );
      })
    ).subscribe(result => {
      this.canEdit = result.isOwner;
      this.username = result.username;

      console.log(this.linkFoto);
      console.log(this.data);
      console.log(this.canEdit);
      console.log(this.username);
    });
  }

  confirmDeletePublication(productID: number): void {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.deletePublication(productID);
    }
  }


  deletePublication(id: number) {
    this.publicationService.deletePublication(id).subscribe((pub: Pub) => {
      console.log('Publicación eliminada');
    });
  }

  editar(id:number){
    this.router.navigate([`publicacion/${id}/editar`])
  }

  navigate(ruta: string): void{
    this.router.navigate([`usuarios/${ruta}`])
  }

}



