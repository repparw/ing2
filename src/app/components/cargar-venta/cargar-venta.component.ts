import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Venta } from 'src/app/models/venta';
import { VentaService } from 'src/app/services/ventaService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cargar-venta',
  templateUrl: './cargar-venta.component.html',
  styleUrls: ['./cargar-venta.component.css']
})
export class CargarVentaComponent implements OnInit {
  ventaForm!: FormGroup;
  registroError!: string;
  ventas!: Venta[];
  id!: number;

  constructor(
    private ventaService: VentaService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = parseInt(this.route.snapshot.params['id']);
    this.initVentaForm();
    this.obtenerVentas();
  }

  initVentaForm(): void {
    this.ventaForm = this.fb.group({
      ventas: this.fb.array([this.createVentaGroup()])
    });
  }

  createVentaGroup(): FormGroup {
    return this.fb.group({
      product: [null, Validators.required],
      quantity: [null, Validators.required],
      price: [null, Validators.required],
      trade: [this.id]
    });
  }

  get ventasFormArray(): FormArray {
    return this.ventaForm.get('ventas') as FormArray;
  }

  addVenta(): void {
    this.ventasFormArray.push(this.createVentaGroup());
  }

  removeVenta(index: number): void {
    this.ventasFormArray.removeAt(index);
  }

  obtenerVentas(): void {
    this.ventaService.obtenerVentas().subscribe(ventas => {
      this.ventas = ventas;
    });
  }

  cargarVenta(): void {
    if (this.ventaForm.valid) {
      const nuevasVentas: Venta[] = this.ventaForm.value.ventas;
      this.ventaService.cargarVenta(nuevasVentas).subscribe(
        response => {
          console.log('Ventas cargadas exitosamente', response);
          Swal.fire({
            title: 'Ventas cargadas exitosamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => { window.history.back(); });
        },
        error => {
          console.error('Error al cargar las ventas', error);
          this.registroError = "Error al registrar las ventas. Intente nuevamente";
          // wait 5s and clear the error message
          setTimeout(() => {
            this.registroError = '';
          }, 5000);
        }
      );
    }
  }

  hasAnyErrors(controlName: string, errorType: string): boolean {
    for (let i = 0; i < this.ventasFormArray.length; i++) {
      const control = (this.ventasFormArray.at(i) as FormGroup).get(controlName);
      if (control && control.hasError(errorType) && (control.dirty || control.touched)) {
        return true;
      }
    }
    return false;
  }
}
