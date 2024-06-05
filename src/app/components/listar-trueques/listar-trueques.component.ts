import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { UserService } from '../../services/user.service'
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publicacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-trueques',
  templateUrl: './listar-trueques.component.html',
  styleUrls: ['./listar-trueques.component.css']
})
export class ListarTruequesComponent implements OnInit {
    @Input() data: any[] = [];
    @Input() mensajeFallido?: string;
    @Input() titulo?: string;
    @Input() userID?: number;
    @Input() empleado?: boolean;
    show: boolean[] = []; 
    fecha2?: Date;   

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

    navigateFecha(id: number){
      this.router.navigate([`agregar-fecha/${id}`])
    }

    cancel(id: number){
      Swal.fire({
        title: "¿Estás seguro de que deseas cancelar el trueque?",
        text: "Se borrará para siempre.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Confirmar"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "¡Cancelado!",
            text: "El trueque ha sido cancelado.",
            icon: "success"
          });
          /* Borrar trueque de la base de datos. Refresh */
        }
      });
    }

    fechaMas24(fecha: Date): Date{
      let fecha2 = new Date(fecha)
      console.log(fecha2.toString());
      fecha2.setDate(fecha2.getDate()+1);
      console.log(fecha2.toString());
      return fecha2;
    }

    pasoElTiempo(fecha: Date): boolean{
      let fechaDeHoy = new Date()
      if ((fecha.getTime() - fechaDeHoy.getTime()) > 0){
        return false
      }
      return true;
    }
  }