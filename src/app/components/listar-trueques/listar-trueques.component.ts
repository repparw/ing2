import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { TradeService } from 'src/app/services/trade.service';
import { Router } from '@angular/router';
import { PublicationService } from 'src/app/services/publication.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { EmailService } from 'src/app/services/email.service';
import { TradeProposal } from 'src/app/models/tradeProposal';
import { RatingService } from 'src/app/services/rating.service';
import { Rating } from 'src/app/models/rating';
import { User } from 'src/app/models/user';
import { SucursalRating } from 'src/app/models/sucursalRating';
import { SucursalRatingService } from 'src/app/services/sucursalRating.service';

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
    usuarioActual?: number;

    constructor (private tradeService: TradeService,
                 private publicationService: PublicationService,
                 private router:Router,
                 private emailService: EmailService,
                 private userService: UserService,
                 private ratingService: RatingService,
                 private sucursalRatingService: SucursalRatingService,
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

    navigateVentas(id: number): void{
      this.router.navigate([`trueque/${id}/cargar-venta`])
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
      this.limitDate.setHours(this.limitDate.getHours() + 3);
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
      ' del usuario ' + trueque.recipient.name + ' con el usuario ' + trueque.proposer.name + ' ha sido cancelado.' ;
      this.emailService.sendEmail(asuntoCancelar, mensajeCancelar, [receptorMail]).subscribe(
      response => {
      console.log('Email sent successfully', response);
      },
      error => {
      console.error('Error sending email', error);
      }
      );
    }

    tradeParticipant(trueque: TradeProposal): boolean{
      if (this.userID == trueque.proposer.id || this.userID == trueque.recipient.id){
        return true;
      }
      else{
        return false;
      }
    }

    tradeStatus(status: string){
      switch (status){
        case 'concreted':
        case 'Concreted':
          return "Concretado";
        case 'pending':
        case 'Pending':
          return "Pendiente de aceptación"
        case 'accepted':
        case 'Accepted':
          return "Aceptado"
        case 'rejected':
        case 'Rejected':
          return 'Oferta rechazada'
        case 'cancelled':
        case 'Cancelled':
          return 'Cancelado'
        case 'confirmed':
        case 'Confirmed':
          return 'Confirmado'
        case 'not_finished':
        case 'Not Finished':
          return 'No Finalizado'
      }
      return '';
    }

    valoro(trueque: TradeProposal): boolean{
      if (this.userID == trueque.proposer.id && trueque.proposer_rated){
        return true;
      }
      else{
        if (this.userID == trueque.recipient.id && trueque.recipient_rated){
          return true;
        }
        else{
          return false;
        }
      }
    }    

    valoroSucursal(trueque: TradeProposal): boolean{
      if (this.userID == trueque.proposer.id && trueque.proposer_rated_sucursal){
        return true;
      }
      else{
        if (this.userID == trueque.recipient.id && trueque.recipient_rated_sucursal){
          return true;
        }
        else{
          return false;
        }
      }
    }    

    popupValorar(trueque: TradeProposal, id: number){
      //Popup
      Swal.fire({
        title: "Califica a este usuario",
        icon: "info",
        input: "range",
        inputLabel: "Valoración",
        inputAttributes: {
          min: "1",
          max: "10",
          step: "1"
        },
        inputValue: 1
      })
      .then((result) => {
        if (result.isConfirmed) {
          //Crear valoración
          let recipiente: number;
          if (this.userID == trueque.proposer.id){
            recipiente = trueque.recipient.id;
          }
          else{
            recipiente = trueque.proposer.id;
          }
          console.log('Recibipiente:', recipiente);


          let valoracion: Rating = {
            rating_score: result.value,
            recipient: recipiente,
          };
          
          this.ratingService.createRating(valoracion).subscribe(
            (response) => {
              console.log('valoración creada correctamente', response);
              //Actualizar promedio y total de calificaciones del usuario
              this.userService.getUser(recipiente).subscribe({
                next: (user: User) => {
                  this.ratingService.getRatingsForUser(user.id).subscribe({
                    next: (ratings: Rating[]) => {
                      // Calculate the average rating
                      const totalRatings = ratings.length;
                      const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating_score, 0);
                      const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;
              
                    // Update the user's rating and total ratings fields
                      user.rating = averageRating;
                      user.total_ratings = totalRatings;

                    // Log the user object before sending the request
                    console.log('Updating user with data:', user);
              
                      // Update the user
                      this.userService.updateUserById(user.id, user).subscribe({
                        next: (updatedUser: User) => {
                          console.log('Usuario modificado:', updatedUser);
                        },
                        error: (error: any) => {
                          console.error('Error updating user:', error);
                        }
                      });
                    },
                    error: (error: any) => {
                      console.error('Error fetching ratings for user:', error);
                    }
                  });
                },
                error: (error: any) => {
                  console.error('Error fetching current user:', error);
                }
              });
              //Actualizar tradeproposal
              this.tradeService.getTradeProposal(id).subscribe(
                trade => {
                  if(this.userID == trade.recipient.id){
                    trade.recipient_rated = true;
                  }
                  else{
                    trade.proposer_rated = true;
                  }
                  this.tradeService.updateTrade(id, trade).subscribe();
                }
              )
              //Popup de exito
              Swal.fire({
                title: "¡Calificado!",
                text: "Has calificado a este usuario correctamente.",
                icon: "success"
              }).then((result) => {
                window.location.reload()
              });
          },
            (error) => {
              console.log('error');
            }
          )
        }
      });
    }    

    popupValorarSucursal(trueque: TradeProposal, id: number){
      //Popup
      Swal.fire({
        title: "Califica a este sucursal",
        icon: "info",
        input: "range",
        inputLabel: "Valoración",
        inputAttributes: {
          min: "1",
          max: "10",
          step: "1"
        },
        inputValue: 1
      })
      .then((result) => {
        if (result.isConfirmed) {
          //Crear valoración sucursal
          let sucId: number;
          let comentario: string = '';
          if(trueque.suc?.id != undefined){
            sucId = parseInt(trueque.suc.id);
            console.log('Sucursal:', sucId);
            
            let valoracion: SucursalRating = {
              rating_score: result.value,
              sucursal: sucId,
              comment: comentario,
            };

            //Agrega el comentario
            Swal.fire({
              input: "textarea",
              inputLabel: "Comentario sobre el empleado",
              inputPlaceholder: "Escriba el comentario aquí...",
              inputAttributes: {
                "aria-label": "Escriba el comentario aquí"
              },
              showCancelButton: true,
            }).then((result) => {
              if(!result.value){
                Swal.fire({
                  title: "Advertencia",
                  text: "Debes escribir un comentario para por valorar la sucursal.",
                  icon: "warning"
                });
              }
              else{
                valoracion.comment = result.value;
                //Crea valoración de la sucursal
                this.sucursalRatingService.addRating(valoracion).subscribe(
                  (response) => {
                    console.log('valoración creada correctamente', response);
                },
                  (error) => {
                    console.log('error');
                  }
                )

                //Actualizar tradeproposal
                this.tradeService.getTradeProposal(id).subscribe(
                trade => {
                  if(this.userID == trade.recipient.id){
                    trade.recipient_rated_sucursal = true;
                  }
                  else{
                    trade.proposer_rated_sucursal = true;
                  }
                  this.tradeService.updateTrade(id, trade).subscribe();
                })

                //Popup de exito
                Swal.fire({
                  title: "¡Calificado!",
                  text: "Has calificado a esta sucursal correctamente.",
                  icon: "success"
                }).then((result) => {
                  window.location.reload()
                });
              }
            })
          }
        }
      });
    }    
}


