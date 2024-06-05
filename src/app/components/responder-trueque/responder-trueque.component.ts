import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeProposal } from 'src/app/models/tradeProposal';
import { EmailService } from 'src/app/services/email.service';
import { PublicationService } from 'src/app/services/publicacion.service';
import { TradeService } from 'src/app/services/trade.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-responder-trueque',
  templateUrl: './responder-trueque.component.html',
  styleUrls: ['./responder-trueque.component.css']
})
export class ResponderTruequeComponent implements OnInit{
  tradeID?: number;
  trueque?: any;
  publicacion: any[] = [];
  asuntoProposer: string = "Trueque aceptado";
  asuntoRecipient: string = "Usted ha aceptado un trueque";
  mensajeProposer?: string;
  mensajeRecipient?: string;
  
  constructor(private router:Router, private route: ActivatedRoute, private tradeService: TradeService, private emailService: EmailService){}

  ngOnInit(): void {
    this.tradeID = parseInt(this.route.snapshot.params['id'], 10);
    this.tradeService.getTradeProposal(this.tradeID).subscribe(
      data => {
        this.trueque = data;
        this.publicacion.push(this.trueque.publication);
      },
      error => {
        console.error('Error fetching trade proposal', error);
      }
    );
      
  }

  aceptar(){
    //Envío de mails: ANDA!
    this.enviarMails();

    //Pasar el estado a aceptado
    const updatedTrade: TradeProposal = this.trueque;
    updatedTrade.status = 'accepted';
    this.tradeService.updateTrade(this.trueque.id, updatedTrade).subscribe(
      data => {
        console.log('Trade proposal updated successfully', data);
      },
      error => {
        console.error('Error updating trade proposal', error);
      }
    );

    //Popup y redirect al home:
    Swal.fire({
      title: "¡Aceptado!",
      text: "El trueque ha sido aceptado. Se le ha envíado un correo con información detallada",
      icon: "success"
    }).then((result) => {
      if (result.isConfirmed){
        Swal.fire({
          title: "Coordina la fecha con el usuario " + this.trueque.proposer.name,
          text: "Mail: " + this.trueque.proposer.email,
        }).then((result) => {
          if (result.isConfirmed){
            this.navigate();
          }
        });
      }
    });
  }

  rechazar(){
    Swal.fire({
      title: "¿Estás seguro de que deseas rechazar el trueque?",
      text: "La propuesta se borrará para siempre.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "¡Rechazado!",
          text: "El trueque ha sido rechazado.",
          icon: "success"
        });

        this.tradeService.deleteTradeProposal(this.trueque.id).subscribe(
          () => {
            console.log('Trade proposal deleted successfully.');
          },
          error => {
            console.error('Error deleting trade proposal:', error);
          }
        );
        this.navigate();
      }
    });
  }

  enviarMails():void{
    let recipientName: string = this.trueque.recipient.name;
    this.mensajeProposer = 'Su propuesta de trueque por el objeto "' + this.trueque.publication.title + '" del usuario ' + recipientName + 
                            ' ha sido aceptada. \n \n Ahora aparecerá en "Mis trueques" como "Trueque con fecha pendiente". \n \n Coordine con ' + recipientName + 
                            ' la fecha y la sucursal donde realizarán el trueque, que luego ' + recipientName + ' deberá cargar. \n \n El email de ' + recipientName 
                            + ' es: ' + this.trueque.recipient.email;
    this.emailService.sendEmail(this.asuntoProposer, this.mensajeProposer, ['cachitococo@gmail.com']).subscribe(
      response => {
        console.log('Email sent successfully', response);
      },
      error => {
        console.error('Error sending email', error);
      }
    );
    let proposerName: string = this.trueque.proposer.name;  
    this.mensajeRecipient =  'Usted ha aceptado la propuesta de trueque del usuario ' + proposerName + ' por la publicación "' + this.trueque.publication.title + 
    '". \n \n Ahora aparecerá en "Mis trueques" como "Trueque con fecha pendiente". \n \n Coordine con ' + proposerName + 
    ' la fecha y la sucursal donde realizarán el trueque, que luego usted deberá cargar en la sección previamente mencionada. \n \n El email de ' + proposerName 
    + ' es: ' + this.trueque.proposer.email;                   
    this.emailService.sendEmail(this.asuntoRecipient, this.mensajeRecipient, ['cachitococo@gmail.com']).subscribe(
      response => {
        console.log('Email sent successfully', response);
      },
      error => {
        console.error('Error sending email', error);
      }
    );
  }

  navigate(): void{
    this.router.navigate(['home'])
  }




}