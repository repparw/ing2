import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publicacion.service';

@Component({
  selector: 'app-listar-trueques',
  templateUrl: './listar-trueques.component.html',
  styleUrls: ['./listar-trueques.component.css']
})
export class ListarTruequesComponent implements OnInit {
    @Input() data: any[] = [];
    @Input() mensajeFallido?: string;
    show: boolean[] = [];    

    constructor (private tradeService: TradeService, private router:Router, private userService: UserService, private publicationService: PublicationService){
    }
  
    ngOnInit(): void {
      // Initialize the show array to false for each data item
      console.log(this.data.length)
      this.show = new Array(this.data.length).fill(false);
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['data']) {
        console.log('ngOnChanges - data length:', this.data.length);
        // Re-initialize the show array whenever data changes
        this.show = new Array(this.data.length).fill(false);
      }
    }
      
    toggleShow(index: number): void {
      this.show[index] = !this.show[index];
    }
    
    getPhotos(id: number): string {
      return this.publicationService.getPhoto(id, 1);
    }

    navigate(ruta: string): void{
      this.router.navigate([`usuarios/${ruta}`])
    }

    navigatePubli(ruta: string): void{
      this.router.navigate([`publicacion/${ruta}`])
    }

    navigateTrade(id: number) {
      this.router.navigate([`trueque/${id}`])
    }
  }