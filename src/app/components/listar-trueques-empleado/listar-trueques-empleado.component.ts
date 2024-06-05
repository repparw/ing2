import { Component, Input, OnInit } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-listar-trueques-empleado',
  templateUrl: './listar-trueques-empleado.component.html',
  styleUrls: ['./listar-trueques-empleado.component.css']
})
export class ListarTruequesEmpleadoComponent implements OnInit{
    data: any[] = [];
    filteredData: any[] = [];

    mensajeFallido: string = 'trueques confirmados para esta sucursal'

    titulo: string = '¡Trueque confirmado!'

    currentUserSucursal!: number;
    templateUrl: string = 'http://localhost:4200/trueque/{{id}}';

    constructor (private tradeService: TradeService, private router:Router, private userService: UserService){
    }

    //ESTO ES POR AHORA: LA DATA LA RECIBE COMO PARAMETRO

    ngOnInit(): void {
  this.userService.getCurrentUser().pipe(
    switchMap(user => {
      this.currentUserSucursal = user.suc;
      console.log('Current user sucursal:', this.currentUserSucursal);
      return this.tradeService.getTradeProposalsBySucursal(this.currentUserSucursal);
    })
  ).subscribe(
    data => {
      this.data = data;
      this.filterProposals();
    },
    error => {
      console.error('Error fetching trade proposals by sucursal:', error);
    }
  );
}

  filterProposals(): void {
    this.filteredData = this.data.filter(proposal =>
      proposal.status === 'confirmed'
    );
  }



  }
