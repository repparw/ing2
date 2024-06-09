import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TradeProposal } from 'src/app/models/tradeProposal';
import Swal, { SweetAlertResult } from 'sweetalert2';

import { UserService } from '../../services/user.service';
import { TradeService } from 'src/app/services/trade.service';
import { Venta } from 'src/app/models/venta';
import { Observable } from 'rxjs';
import { VentaService } from 'src/app/services/ventaService';

@Component({
  selector: 'app-concretar-trueque',
  templateUrl: './concretar-trueque.component.html',
  styleUrls: ['./concretar-trueque.component.css']
})
export class ConcretarTruequeComponent implements OnInit {
  tradeID?: number;
  codeForm: FormGroup;
  codigo?: string;
  sales: Venta[] = [];
  trueque: any;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tradeService: TradeService,
    private ventaService: VentaService,
   ) {
    this.codeForm = this.formBuilder.group({
    codigo: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    this.tradeID = parseInt(this.route.snapshot.params['id'], 10);
    this.tradeService.getTradeProposal(this.tradeID).subscribe((tradeProposal: TradeProposal) => {
      this.trueque = tradeProposal;
      this.codigo = tradeProposal.code;
    })
    this.ventaService.obtenerVentasPorTrade(this.tradeID).subscribe((ventas: Venta[]) => {
      this.sales = ventas;
    })
  }

  navigate(): void{
    this.router.navigate([`trueque/${this.tradeID}/cargar-venta`])
  }

  navigateHome(): void{
    this.router.navigate(['home/']);
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.codeForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }

  cambiarEstado(estado: string): void{
    const updatedTrade: TradeProposal = this.trueque;
    updatedTrade.status = estado;
    this.tradeService.updateTrade(this.trueque.id, updatedTrade).subscribe(
      data => {
        console.log('Trade proposal updated successfully', data);
      },
      error => {
        console.error('Error updating trade proposal', error);
      }
    );
  }

  confirmarTrueque(): void{
    this.cambiarEstado('concreted');
    Swal.fire({
      title: "¡Trueque confirmado!",
      text: "El trueque ha sido confirmado correctamente.",
      icon: "success"
    });
    this.navigateHome();
  }

  concretarNoFinalizado(): void{
    this.cambiarEstado('not_finished');
    Swal.fire({
      title: "¡Trueque concretado!",
      text: "El trueque ha sido concretado como 'No finalizado'.",
    });
    this.navigateHome();
  }

  concretar(realizado: boolean) : void{
    if (this.codeForm.invalid) {
      console.log('El formulario es inválido. No se puede modificar.');
      return; // Detener el envío del formulario si hay errores de validación
    }
    if (this.codeForm.get('codigo')?.value !== this.codigo) {
      console.log('El código no coincide con el almacenado en la base de datos.');
      Swal.fire('Error', 'El codigo ingresado no coincide con el código del trueque', 'error');
      return; // Detener el envío del formulario si las contraseñas no son iguales
    }
    else{
      //2 CASOS: Ya tiene ventas cargadas: todo bien. No tiene ventas cargadas: te avisa y te pone el botón.
      //No tiene ventas cargadas:
      if(this.sales?.length == 0){
        Swal.fire({
          title: "¿Estás seguro?",
          text: "Este trueque no tiene ventas asociadas. Si concretas el trueque no podrás cargarlas mas tarde.",
          icon: "warning",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "Concretar sin ventas asociadas",
          denyButtonText: `Cargar ventas`,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            if (realizado){
              this.confirmarTrueque();
            }
            else{
              this.concretarNoFinalizado();
            }
          } else if (result.isDenied) {
            this.navigate();
          }
        });
      }
      //Con ventas ya cargadas: 
      else{
        if (realizado){
          this.confirmarTrueque();
        }
        else{
          this.concretarNoFinalizado();
        }
      }
    }
  }   

}
