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
    filteredData: any[] = [];
    currentUserDni!: string; 
    currentUserId!: number; 
    templateUrl: string = 'http://localhost:4200/trueque/{{id}}';

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
      });}
    
    filterProposals(): void {
      this.filteredData = this.data.filter(proposal => 
        proposal.recipient.id === this.currentUserId && proposal.status === 'pending'
      );
    }

  }