import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SucursalService } from 'src/app/services/sucursal.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-fecha',
  templateUrl: './agregar-fecha.component.html',
  styleUrls: ['./agregar-fecha.component.css']
})
export class AgregarFechaComponent implements OnInit {
  tradeID: number;
  agregarFechaForm: FormGroup;
  sucursales: string[] =[];
  minDate: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private sucursalService: SucursalService){
    this.agregarFechaForm = this.fb.group({
      sucursal: ['', Validators.required],
      fecha: ['', Validators.required] //(YYYY-MM-DD) 
    });
    this.tradeID = parseInt(this.route.snapshot.params['id'], 10);
    sucursalService.getSucursales().subscribe((sucursal) => {
      this.sucursales=(sucursal.map(item => item.direccion));
    }
  )
  const today = new Date();
  this.minDate = today.toISOString().split('T')[0]; // Formato 'yyyy-MM-dd'
}
  ngOnInit(): void {
    
  }

  guardarTrueque(){
    console.log(this.agregarFechaForm.value);

  }

}
