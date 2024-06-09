import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publication.service';
import Swal from 'sweetalert2';
import { EmailService } from 'src/app/services/email.service';
import { TradeProposal } from 'src/app/models/tradeProposal';
import { UserService } from 'src/app/services/user.service';

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

    constructor (private tradeService: TradeService,
                 private publicationService: PublicationService,
                 private router:Router,
                 private emailService: EmailService,
                ){}

    ngOnInit(): void {
      // Initialize the show array to false for each data item
      this.show = new Array(this.data.length).fill(false);
    }

    ngOnChanges(changes: SimpleChanges): void {
      if (changes['data']) {
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

    navigateConcretar(id: number){
      this.router.navigate([`concretar-trueque/${id}`])
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
          this.tradeService.getTradeProposal(id).subscribe(
            trade => {
              trade.status = "cancelled";
              this.tradeService.updateTrade(id, trade).subscribe();
              this.mandarMailCancelar(trade);
              Swal.fire({
                title: "¡Cancelado!",
                text: "El trueque ha sido cancelado.",
                icon: "success"
              }).then(() => { location.reload(); });
      });
    }
    });
    }

    // validate Date is more than 24 hours away from var date
    validateDate(date: Date): boolean {
      const copiedDate = new Date(date);
      this.limitDate = new Date(copiedDate.setDate(copiedDate.getDate() - 1));
      // sum 3 hours to limitDate
      this.limitDate.setHours(this.limitDate.getHours() + 9);
      const currentDate = new Date();
      return this.limitDate.getTime() > currentDate.getTime();
  }
    mandarMailCancelar(trueque: TradeProposal) {
      let receptorMail: string = '';
          if (this.userID == trueque.recipient.id){
            receptorMail = trueque.proposer.email
          }
          else {
            receptorMail = trueque.recipient.email
          }

      let asuntoCancelar = 'Su trueque ha sido cancelado'
      let mensajeCancelar = 'Su trueque por la publicación ' + trueque.publication.title +
      ' del usuario ' + trueque.recipient.name + ' ha sido cancelado.' ;
      this.emailService.sendEmail(asuntoCancelar, mensajeCancelar, [receptorMail]).subscribe(
      response => {
      console.log('Email sent successfully', response);
      },
      error => {
      console.error('Error sending email', error);
      }
      );
    }

  }
