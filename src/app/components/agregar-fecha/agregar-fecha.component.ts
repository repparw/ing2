import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SucursalService } from 'src/app/services/sucursal.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TradeService } from 'src/app/services/trade.service';
import { TradeProposal } from 'src/app/models/tradeProposal';
import { Sucursal } from 'src/app/models/sucursal';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agregar-fecha',
  templateUrl: './agregar-fecha.component.html',
  styleUrls: ['./agregar-fecha.component.css']
})
export class AgregarFechaComponent implements OnInit {
  tradeID: number;
  agregarFechaForm: FormGroup;
  sucursales: Sucursal[] = [];
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private sucursalService: SucursalService,
    private tradeService: TradeService,
    private router: Router
  ) {
    this.agregarFechaForm = this.fb.group({
      sucursal: [0, Validators.required],
      fecha: ['', Validators.required],
      hora: ['', [Validators.required, this.timeRangeValidator]]
    });
    this.tradeID = parseInt(this.route.snapshot.params['id'], 10);

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.sucursalService.getSucursales().subscribe((sucursalData) => {
      this.sucursales = sucursalData;
    });
  }

  timeRangeValidator(control: FormControl): { [key: string]: any } | null {
    const value: string = control.value;
    if (value) {
      const hour = parseInt(value.split(':')[0], 10);
      if (hour < 8 || hour > 16) {
        return { 'timeOutOfRange': true };
      }
    }
    return null;
  }

  onSubmit() {

    this.tradeService.getTradeProposal(this.tradeID).subscribe((tradeProposal: TradeProposal) => {
      console.log(tradeProposal);
      tradeProposal.suc_id = this.agregarFechaForm.value.sucursal as number;
      console.log('fecha:', this.agregarFechaForm.value.fecha);
      tradeProposal.date = this.agregarFechaForm.value.fecha;
      console.log('date:', tradeProposal.date);
      tradeProposal.status="confirmed";

      this.tradeService.updateTrade(this.tradeID, tradeProposal).subscribe(
        updatedTradeProposal => {
          console.log('TradeProposal actualizado:', updatedTradeProposal);
        },
        error => {
          console.error('Error al actualizar el TradeProposal:', error);
        }
      );

    });
    this.router.navigateByUrl('/home');
  }
}
