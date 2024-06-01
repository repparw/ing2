import { Component, Input, OnInit } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-listar-trueques',
  templateUrl: './listar-trueques.component.html',
  styleUrls: ['./listar-trueques.component.css']
})
export class ListarTruequesComponent implements OnInit {
    @Input() data: any[] = [];
    @Input() templateUrl: string = 'http://localhost:4200/publicacion/{{id}}';

    constructor (private tradeService: TradeService, private router:Router, private userService: UserService){
    }
  
    ngOnInit(): void {}
    
    navigate(ruta: string): void{
      this.router.navigate([`usuarios/${ruta}`])
    }

    navigateTrade(id: number) {
      this.router.navigate([`trueque/${id}`])
    }
  }