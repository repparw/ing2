import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodigoDescuentoService } from 'src/app/services/codigoDescuento.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './verificar-codigo.component.html',
  styleUrls: ['./verificar-codigo.component.css']
})
export class VerificarCodigoComponent implements OnInit {
  codigoForm: FormGroup;

  constructor(private fb: FormBuilder, private codigoService: CodigoDescuentoService) {
    this.codigoForm = this.fb.group({
      codigo: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  verificarCodigo(): void {
    const codigo = this.codigoForm.get('codigo')?.value;
    this.codigoService.verificarCodigo(codigo).subscribe(response => {
      const descripcion = response.descripcion;
      Swal.fire({
        title: 'Código de descuento válido',
        text: `Descripción: ${descripcion}`,
        icon: 'success'
      });
      // Borramos el código de descuento a través del backend
      this.codigoService.borrarCodigo(codigo).subscribe(() => {
        console.log('Código de descuento eliminado correctamente.');
      }, error => {
        console.error('Error al borrar el código de descuento:', error);
      });
    }, error => {
      Swal.fire({
        title: 'Código de descuento inválido',
        text: 'El código de descuento proporcionado no es válido.',
        icon: 'error',
        showConfirmButton: true
      });
    });
  }
}
