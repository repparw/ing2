import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { Pub } from '../../models/pub';
import { Observable, pluck, take, map, switchMap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { PublicationService } from '../../services/publicacion.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-publicacion',
  templateUrl: './ver-publicacion.component.html',
  styleUrls: ['./ver-publicacion.component.css']
})
export class VerPublicacionComponent implements OnInit{
  data: Pub | null = null;
  username: string | null = null;
  owner: string | null = null;
  linkFoto!: any;
  productID!: number;
  canEdit!: boolean;

  pricingGuide = [
    { range: '$1-1000', category: 'I' },
    { range: '$1000-2500', category: 'II' },
    { range: '$2500-5000', category: 'III' },
    { range: '$5000-7500', category: 'IV' },
    { range: '$7500-10000', category: 'V' },
    { range: '$10000-20000', category: 'VI' },
    { range: '$20000-40000', category: 'VII' },
    { range: '$40000-70000', category: 'VIII' },
    { range: '$70000-100000', category: 'IX' },
    { range: '>$100000', category: 'X' }
  ];

  constructor (private route: ActivatedRoute, private  publicationService: PublicationService, private userService: UserService, private router:Router ){

  }

 ngOnInit(): void {
    this.productID = parseInt(this.route.snapshot.params['id'], 10);

    this.publicationService.getPublication(this.productID).subscribe(
      publication => {
        this.data = publication;
        this.linkFoto = this.publicationService.getPhotos(this.productID);
        this.loadAdditionalData(publication);
      },
      error => {
        console.error('Error fetching publication:', error);
      }
    );
  }

  loadAdditionalData(publication: Pub): void {
    if (this.userService.isAuthenticated()) {
      this.userService.isOwner(publication).subscribe(
        isOwner => {
          this.canEdit = isOwner;
        },
        error => {
          console.error('Error checking owner status:', error);
        }
      );

      this.userService.getUser(publication.user).subscribe(
        user => {
          this.username = user.username;
          this.owner = user.name;
        },
        error => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }
  confirmDeletePublication(productID: number): void {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Estás seguro de que deseas eliminar esta publicación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
          }).then((result) => {
      if (result.isConfirmed) {
        this.deletePublication(productID);
      }
          });
  }


  deletePublication(id: number) {
    this.publicationService.deletePublication(id).subscribe((pub: Pub) => {
      console.log('Publicación eliminada');
    });
  }

  editar(id:number){
    this.router.navigate([`publicacion/${id}/editar`])
  }

  proponerTrueque(id:number){
    this.router.navigate([`publicacion/${id}/proponer`])
    }

  navigate(ruta: string): void{
    this.router.navigate([`usuarios/${ruta}`])
  }

  showPricingGuide(): void {
    const guide = this.pricingGuide.map(item => `${item.category} ${item.range}`).join('<br>');
    Swal.fire({
      title: 'Guía de Precios',
      html: guide,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

  getCategory(price: number): string {
    for (let item of this.pricingGuide) {
      const [min, max] = item.range.replace(/[$,>]/g, '').split('-').map(Number);
      if (price >= min && (max ? price <= max : true)) {
        return item.category;
      }
    }
    return 'N/A';
  }

}



