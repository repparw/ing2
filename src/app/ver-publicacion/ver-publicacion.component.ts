import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { Pub } from '../services/pub';
import { Observable } from 'rxjs';
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
  linkFoto!: any;
  productID!: number;
  canEdit!: boolean;
  constructor (private route: ActivatedRoute, private  publicationService: PublicationService, private userService: UserService, private router:Router ){

  }
  ngOnInit(): void {
    this.productID=parseInt(this.route.snapshot.params['id']);
    console.log(this.productID)
    this.publicationService.getPublication(this.productID).subscribe(data => {
      if (data) { // Check if data is not null
        this.data = data;
        this.linkFoto = this.publicationService.getPhotos(this.productID);
        this.userService.isOwner(this.data).subscribe(
          isOwner => {
          this.canEdit = isOwner;
        });
        console.log(this.linkFoto);
        console.log(this.data);
      } else {
        console.log('No data received'); // Handle no data case (optional)
      }
    });
    console.log(this.data);
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
}



