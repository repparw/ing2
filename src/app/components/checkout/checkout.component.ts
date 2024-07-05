// checkout.component.ts

import { Component } from '@angular/core';
import { MercadoPagoService } from 'src/app/services/mercado-pago.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {

  constructor(private mercadoPagoService: MercadoPagoService) { }

  iniciarPago(): void {
    const preferenceData = {
      items: [
        {
          title: 'Producto de prueba',
          unit_price: 1000, // Precio del producto en centavos
          quantity: 1
        }
      ],
      payer: {
        email: 'usuario@ejemplo.com'
      }
    };

    this.mercadoPagoService.generatePreference(preferenceData).subscribe(preference => {
      // Redirigir al usuario al formulario de pago de Mercado Pago
      window.location.href = preference.init_point;
    }, error => {
      console.error('Error al generar la preferencia de pago', error);
      // Manejar errores según sea necesario
    });
  }
}
