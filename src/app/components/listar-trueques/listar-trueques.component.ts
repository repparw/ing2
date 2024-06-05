import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-trueques',
  templateUrl: './listar-trueques.component.html',
  styleUrls: ['./listar-trueques.component.css']
})
export class ListarTruequesComponent implements OnInit, OnChanges {
    @Input() data: any[] = [];
    @Input() mensajeFallido?: string;
    @Input() titulo?: string;
    @Input() userID?: number;
    @Input() empleado?: boolean;
    show: boolean[] = [];
    fecha2?: Date;
    limitDate?: Date;

    // TODO trade and user service not used?
    constructor (private tradeService: TradeService,
                 private publicationService: PublicationService,
                 private router:Router,
                ){}

    ngOnInit(): void {
      // Initialize the show array to false for each data item
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
          this.tradeService.getTradeProposal(id).subscribe(
            trade => {
              trade.status = "cancelled";
              this.tradeService.updateTrade(id, trade).subscribe();
      });
      }
      });
    }

    // validate Date is more than 24 hours away from var date
    validateDate(date: Date): boolean {
      // save limitDate with value date - 24 hours
      this.limitDate = (new Date(date.setDate(date.getDate() - 1)));
      const currentDate = new Date();
      const date2 = new Date(date);
      const diff = date2.getTime() - currentDate.getTime();
      return diff > 86400000;
    }

  }
