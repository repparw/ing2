import { Component, OnInit } from '@angular/core';
import { Pub } from '../../models/pub';
import { PublicationService } from '../../services/publication.service';
import { TradeService } from '../../services/trade.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-publicacion',
  templateUrl: './ver-publicacion.component.html',
  styleUrls: ['./ver-publicacion.component.css']
})
export class VerPublicacionComponent implements OnInit {
  data: Pub | null = null;
  username: string | null = null;
  owner: string | null = null;
  linkFoto!: string[];
  productID!: number;
  canEdit!: boolean;


  constructor(private route: ActivatedRoute,
    private publicationService: PublicationService,
    private tradeService: TradeService,
    private userService: UserService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.productID = parseInt(this.route.snapshot.params['id'], 10);

    this.publicationService.getPublication(this.productID).subscribe(
      publication => {
        this.data = publication;
        this.loadAdditionalData(publication);
        this.publicationService.getPhotos(this.productID).subscribe(
          data => {
            this.linkFoto = data;
          },
          error => {
            console.error('Error fetching photos:', error);
          }
        );
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
    };

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

  confirmDeletePublication(productID: number): void {
    // First, check if the publication is part of a 'status' = confirmed tradeProposal
    this.tradeService.getTradeProposalsByPublication(productID).subscribe(
      (proposals: any[]) => {
        const confirmedProposal = proposals.find(proposal => proposal.status === 'confirmed');
        if (confirmedProposal) {
          // If there's a confirmed proposal, show an alert that the publication can't be deleted
          Swal.fire({
            title: 'No se puede eliminar',
            text: 'Esta publicación no se puede eliminar porque tiene un trueque confirmado asociado.',
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        } else {
          // If no confirmed proposal found, confirm deletion of the publication
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
              Swal.fire('Publicación eliminada', 'La publicación ha sido eliminada exitosamente', 'success').then(() => {
                this.router.navigate(['/home']);
              });
            }
          });
        }
      },
      error => {
        // Handle error fetching trade proposals appropriately
        Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al verificar el estado del trueque asociado a la publicación.',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    );
  }

  getCategory(price: number): string {
    return this.publicationService.getCategory(price)
  }

  deletePublication(id: number) {
    this.publicationService.deletePublication(id).subscribe((pub: Pub) => {
      console.log('Publicación eliminada');
    });
  }

  editar(id: number) {
    this.router.navigate([`publicacion/${id}/editar`])
  }

  proponerTrueque(id: number) {
    this.router.navigate([`publicacion/${id}/proponer`])
  }

  navigate(ruta: string): void {
    this.router.navigate([`usuarios/${ruta}`])
  }

  showPricingGuide(): void {
    const guide = this.publicationService.pricingGuide.map(item => `${item.category} ${item.range}`).join('<br>');
    Swal.fire({
      title: 'Guía de Precios',
      html: guide,
      icon: 'info',
      confirmButtonText: 'Cerrar'
    });
  }

}



