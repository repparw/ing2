import { Component, Input, OnInit } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-ofertas-recibidas',
  templateUrl: './listar-ofertas-recibidas.component.html',
  styleUrls: ['./listar-ofertas-recibidas.component.css']
})
export class ListarOfertasRecibidasComponent implements OnInit{
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
    
    currentUserDni!: string; 
    currentUserId!: number; 
    templateUrl: string = 'http://localhost:4200/trueque/{{id}}';
    showList: boolean[] = [false, false, false];



    constructor (private tradeService: TradeService, private router:Router, private userService: UserService){
    }
  
    //ESTO ES POR AHORA: LA DATA LA RECIBE COMO PARAMETRO
    ngOnInit(): void {   
      this.userService.getCurrentUser().subscribe(
        user => {
          this.currentUserDni = user.username;
          this.currentUserId = user.id;
        });
      this.tradeService.getTradeProposals(this.currentUserDni).subscribe(data => {
        this.data = data;
        this.filterProposals();
        this.filterTradeToConfirm();
        this.filterConfirm()
      });}
    
    filterProposals(): void {
      this.filteredDataProposal = this.data.filter(proposal => 
        proposal.recipient.id === this.currentUserId && proposal.status === 'pending'
      );
    }

    /* REVISAR QUE ANDE!!!!!! */
    filterTradeToConfirm(): void {
      this.filteredDataTradeToConfirm = this.data.filter(proposal => 
        proposal.recipient.id === this.currentUserId && proposal.status === 'accepted' && proposal.date === null
      );
    }

    filterConfirm(): void {
      this.filteredDataConfirm = this.data.filter(proposal => 
        proposal.recipient.id === this.currentUserId && proposal.status === 'accepted' && proposal.date != null
      );
    }

    toggleList(index: number): void {
      this.showList[index] = !this.showList[index];
    }

  }