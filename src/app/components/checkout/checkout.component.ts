import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MercadoPagoService } from 'src/app/services/mercado-pago.service';

declare const MercadoPago: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  checkoutForm: FormGroup;
  totalAmount: number = 0;

  constructor(
    private fb: FormBuilder,
    private mercadoPagoService: MercadoPagoService
  ) {
    this.checkoutForm = this.fb.group({
      weeks: ['', Validators.required]
    });

    this.checkoutForm.get('weeks')?.valueChanges.subscribe(value => {
      this.totalAmount = value ? value * 1000 : 0;
    });
  }

  iniciarPago(): void {
    const preferenceData = {
      items: [
        {
          title: 'Destacar publicación',
          unit_price: this.totalAmount,
          quantity: 1
        }
      ],
      payer: {
        email: 'usuario@ejemplo.com'
      }
    };

    this.mercadoPagoService.generatePreference(preferenceData).subscribe(preference => {
      // Inicia el Checkout Pro de Mercado Pago
      const mp = new MercadoPago('APP_USR-2fdf1ea5-99b4-4cdc-9b27-0816f21433c4', {
        locale: 'es-AR'
      });

      mp.checkout({
        preference: {
          id: preference.id
        },
        autoOpen: true, // Abre el Checkout Pro automáticamente
      });
    }, error => {
      console.error('Error al generar la preferencia de pago', error);
      // Manejar errores según sea necesario
    });
  }
}
