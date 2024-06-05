import { Component, OnInit } from '@angular/core';
import { SucursalService } from '../../services/sucursal.service';

@Component({
  selector: 'app-listar-sucursales',
  templateUrl: './listar-sucursales.component.html',
  styleUrls: ['./listar-sucursales.component.css']
})
export class ListarSucursalesComponent implements OnInit {
  data: any[] = [];
  templateUrl: string = 'http://localhost:4200/sucursal/{{id}}';
  selectedSucursal: any = null;

  constructor(private sucursalService: SucursalService) { }

  ngOnInit(): void {
    this.sucursalService.getSucursales().subscribe((data: any[]) => {
      this.data = data;
    });
  }

  generateLink(id: number): string {
    return this.templateUrl.replace('{{id}}', id.toString());
  }

  getPhotos(id: number): string {
    return this.sucursalService.getPhotos(id);
      }

  selectSucursal(sucursal: any): void {
    this.selectedSucursal = sucursal;
  }

}
