import { Component, OnInit } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service'
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';

import { TradeProposal } from 'src/app/models/tradeProposal';
import { Pub } from 'src/app/models/pub';
import { Sucursal } from 'src/app/models/sucursal';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-listar-ofertas-recibidas',
  templateUrl: './listar-ofertas-recibidas.component.html',
  styleUrls: ['./listar-ofertas-recibidas.component.css']
})
export class ListarOfertasRecibidasComponent implements OnInit {
    data: any[] = [];
    filteredDataProposal: any[] = [];
    filteredDataTradeToConfirm: any[] = [];
    filteredDataConfirm: any[] = [];

    mensajeFallidoPropuesta: string = 'propuestas de trueque recibidas'
    mensajeFallidoSinFecha: string = 'trueques con fecha pendiente'
    mensajeFallidoConfirmado: string = 'trueques confirmados'

    tituloPropuesta: string = '¡Oferta de trueque recibida!'
    tituloSinFecha: string = 'Confirmar fecha para realizar este trueque:'
    tituloConfirmado: string = '¡Trueque confirmado!'

    currentUserId!: number;
    showList: boolean[] = [false, false, false];



    constructor (private tradeService: TradeService,
                 private router:Router,
                 private userService: UserService
                ){}

    //ESTO ES POR AHORA: LA DATA LA RECIBE COMO PARAMETRO
    ngOnInit(): void {
        this.userService.getCurrentUser().subscribe({
          next: (user: User) => {
            this.currentUserId = user.id; // Assuming id is the user's ID field in your User model

            // Once you have the current user, fetch trade proposals
            this.fetchTradeProposals();
          },
          error: (error: any) => {
            console.error('Error fetching current user:', error);
            // Handle error fetching current user
          }
        });
      }

    fetchTradeProposals(): void {
      this.tradeService.getTradeProposals().subscribe({
        next: (response: TradeProposal[]) => {
          this.data = response;
          console.log('Proposals:', this.data);

          // Apply filters after fetching data
          this.filterTradeToConfirm();
          this.filterProposals();
          this.filterConfirm();

          console.log('Filtered proposals to confirm:', this.filteredDataTradeToConfirm);
          console.log('Filtered proposals:', this.filteredDataProposal);
          console.log('Filtered confirmations:', this.filteredDataConfirm);
        },
        error: (error: any) => {
          console.error('Error fetching trade proposals:', error);
          // Handle error fetching trade proposals
        }
      });
    }

    filterProposals(): void {
      this.filteredDataProposal = this.data.filter(proposal =>
        proposal.recipient.id === this.currentUserId && proposal.status === 'pending'
      );
    }

    /* REVISAR QUE ANDE!!!!!! */
    filterTradeToConfirm(): void {
      this.filteredDataTradeToConfirm = this.data.filter(proposal =>
        (proposal.recipient.id === this.currentUserId || proposal.proposer.id === this.currentUserId) && proposal.status === 'accepted'
      );
    }

    filterConfirm(): void {
      this.filteredDataConfirm = this.data.filter(proposal =>
        (proposal.recipient.id === this.currentUserId || proposal.proposer.id === this.currentUserId) && proposal.status === 'confirmed'
      );
    }

    toggleList(index: number): void {
      this.showList[index] = !this.showList[index];
    }

  }
