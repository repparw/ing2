import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/ventaService';

@Component({
  selector: 'app-cargar-venta',
  templateUrl: './cargar-venta.component.html',
  styleUrls: ['./cargar-venta.component.css']
})
export class CargarVentaComponent implements OnInit{
  
  ventaForm!: FormGroup;
  registroError!: string;
  ventas!: Venta[];
  id!: number;

  constructor(private ventaService: VentaService, private fb: FormBuilder, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.params['id']);
    this.initVentaForm();
    this.obtenerVentas();
  }
 
  initVentaForm(): void {
    this.ventaForm = this.fb.group({
      product: [null, Validators.required],
      quantity: [null, Validators.required],
      price: [null, Validators.required],
      trade: [this.id]
    });
  }

  obtenerVentas(): void {
    this.ventaService.obtenerVentas().subscribe(ventas => {
      this.ventas = ventas;
    });
  }

  cargarVenta(): void {
    if (this.ventaForm.valid) {
      const nuevaVenta: Venta = this.ventaForm.value;
      this.ventaService.cargarVenta(nuevaVenta).subscribe(
        response => {
          console.log('Venta cargada exitosamente', response);
          this.obtenerVentas();
          this.ventaForm.reset();
        },
        error => {
          console.error('Error al cargar la venta', error);
          this.registroError = "Error al registrar la venta. Intente nuevamente";
        }
      );
    }
  }

  hasErrors(controlName: string, errorType: string) {
    const control = this.ventaForm.get(controlName);
    return control && control.hasError(errorType) && (control.dirty || control.touched);
  }


}
